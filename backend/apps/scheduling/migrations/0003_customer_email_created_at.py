from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("scheduling", "0002_timeblock"),
    ]

    operations = [
        migrations.AddField(
            model_name="customer",
            name="email",
            field=models.EmailField(blank=True, default="", max_length=254),
        ),
        migrations.AddField(
            model_name="customer",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, null=True),
            preserve_default=False,
        ),
    ]