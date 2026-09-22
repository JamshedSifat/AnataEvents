"""Base viewset machinery shared by all admin CRUD endpoints."""

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.audit import (
    ACTION_CREATE,
    ACTION_DELETE,
    ACTION_PUBLISH,
    ACTION_UNPUBLISH,
    ACTION_UPDATE,
    diff_changes,
    log_action,
)
from core.permissions import IsEditorOrReadOnly


class AdminCrudViewSet(viewsets.ModelViewSet):
    """Admin CRUD with publish toggle, reorder and bulk delete.

    Subclasses set: queryset, serializer_class (+ write variant), permission
    is IsEditorOrReadOnly by default. Every write is audit-logged.
    """

    permission_classes = [IsAuthenticated, IsEditorOrReadOnly]
    # Model fields that may appear in the audit diff.
    audit_fields: tuple = ()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(
            self.request,
            ACTION_CREATE,
            instance,
            changes={k: str(v)[:200] for k, v in serializer.validated_data.items()},
        )

    def perform_update(self, serializer):
        changes = (
            diff_changes(serializer.instance, serializer.validated_data, self.audit_fields)
            if self.audit_fields
            else None
        )
        instance = serializer.save()
        log_action(self.request, ACTION_UPDATE, instance, changes=changes)

    def perform_destroy(self, instance):
        log_action(self.request, ACTION_DELETE, instance)
        instance.delete()

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        obj = self.get_object()
        obj.is_published = True
        obj.save(update_fields=["is_published", "updated_at"])
        log_action(request, ACTION_PUBLISH, obj)
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=["post"], url_path="unpublish")
    def unpublish(self, request, pk=None):
        obj = self.get_object()
        obj.is_published = False
        obj.save(update_fields=["is_published", "updated_at"])
        log_action(request, ACTION_UNPUBLISH, obj)
        return Response(self.get_serializer(obj).data)

    @action(detail=False, methods=["post"], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids") or []
        if not isinstance(ids, list) or not ids:
            return Response(
                {"detail": "Provide a non-empty 'ids' list."}, status=status.HTTP_400_BAD_REQUEST
            )
        qs = self.get_queryset().filter(id__in=ids)
        count = qs.count()
        for obj in qs:
            log_action(request, ACTION_DELETE, obj)
        qs.delete()
        return Response({"deleted": count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="reorder")
    def reorder(self, request):
        """Body: {"ordered_ids": [3, 1, 2]} — assigns order by list index."""
        ordered_ids = request.data.get("ordered_ids") or []
        if not isinstance(ordered_ids, list):
            return Response(
                {"detail": "Provide 'ordered_ids' list."}, status=status.HTTP_400_BAD_REQUEST
            )
        model = self.get_queryset().model
        objs = list(self.get_queryset().filter(id__in=ordered_ids))
        by_id = {str(o.pk): o for o in objs}
        missing = [i for i in map(str, ordered_ids) if i not in by_id]
        if missing:
            return Response(
                {"detail": f"Unknown ids: {missing[:10]}"}, status=status.HTTP_400_BAD_REQUEST
            )
        for idx, pk in enumerate(ordered_ids):
            obj = by_id[str(pk)]
            if obj.order != idx:
                obj.order = idx
                obj.save(update_fields=["order"])
        log_action(
            request,
            ACTION_UPDATE,
            model,
            model_name=model.__name__,
            object_id="",
            changes={"order": "reordered"},
        )
        return Response({"updated": len(ordered_ids)})


class PublicReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    """Public, published-only, read-only listing/lookup endpoint."""

    permission_classes = []
    lookup_field = "slug"
    lookup_value_regex = "[^/]+"

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(is_published=True)
