from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ("scheduling", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="TimeBlock",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("starts_at", models.DateTimeField()),
                ("ends_at", models.DateTimeField()),
                ("reason", models.CharField(blank=True, default="", max_length=180)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("professional", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="timeblocks", to="scheduling.professional")),
                ("tenant", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="timeblocks", to="core.tenant")),
            ],
        ),
        migrations.AddIndex(
            model_name="timeblock",
            index=models.Index(fields=["tenant", "starts_at"], name="scheduling_t_tenant__0f3e0a_idx"),
        ),
        migrations.AddIndex(
            model_name="timeblock",
            index=models.Index(fields=["professional", "starts_at"], name="scheduling_t_profess_9f9e2b_idx"),
        ),
    ]