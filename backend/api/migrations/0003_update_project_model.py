from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_project_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='image',
        ),
        migrations.RemoveField(
            model_name='project',
            name='technologies',
        ),
        migrations.AddField(
            model_name='project',
            name='architecture_projet',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='role_personnel',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='specificites_competences',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='project',
            name='video_url',
            field=models.URLField(default='', max_length=500),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='technologies',
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='project',
            name='title',
            field=models.CharField(max_length=200),
        ),
    ]
