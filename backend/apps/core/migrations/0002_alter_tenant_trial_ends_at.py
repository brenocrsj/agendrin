from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tenant",
            name="trial_ends_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]