# Generated by Django 5.0.1 on 2024-04-15 20:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='session_id',
            field=models.CharField(max_length=255),
        ),
    ]