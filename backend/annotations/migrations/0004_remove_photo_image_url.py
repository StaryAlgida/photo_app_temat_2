# Generated by Django 5.0.6 on 2024-06-23 14:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('annotations', '0003_group_photo_groups'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='photo',
            name='image_url',
        ),
    ]
