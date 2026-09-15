from django.contrib import admin
from .models import Item

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "quantity", "price", "category", "created_at")
    search_fields = ("name", "category")
