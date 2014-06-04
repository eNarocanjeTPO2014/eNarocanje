# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ServiceProviderEmployee'
        db.create_table(u'ServiceProviderEmployee_serviceprovideremployee', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('service_provider', self.gf('django.db.models.fields.related.ForeignKey')(related_name='employees', to=orm['accountext.ServiceProvider'])),
            ('service', self.gf('django.db.models.fields.related.ForeignKey')(related_name='employees', to=orm['service.Service'])),
            ('first_name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('last_name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('active_from', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('active_to', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('picture', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
            ('picture_width', self.gf('django.db.models.fields.PositiveIntegerField')(null=True)),
            ('picture_height', self.gf('django.db.models.fields.PositiveIntegerField')(null=True)),
        ))
        db.send_create_signal(u'ServiceProviderEmployee', ['ServiceProviderEmployee'])

        # Adding model 'ServiceProviderEmployeeImage'
        db.create_table(u'ServiceProviderEmployee_serviceprovideremployeeimage', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('image_width', self.gf('django.db.models.fields.PositiveIntegerField')(null=True)),
            ('image_height', self.gf('django.db.models.fields.PositiveIntegerField')(null=True)),
            ('delete_image', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('service_provider', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['accountext.ServiceProvider'])),
        ))
        db.send_create_signal(u'ServiceProviderEmployee', ['ServiceProviderEmployeeImage'])


    def backwards(self, orm):
        # Deleting model 'ServiceProviderEmployee'
        db.delete_table(u'ServiceProviderEmployee_serviceprovideremployee')

        # Deleting model 'ServiceProviderEmployeeImage'
        db.delete_table(u'ServiceProviderEmployee_serviceprovideremployeeimage')


    models = {
        u'ServiceProviderEmployee.serviceprovideremployee': {
            'Meta': {'object_name': 'ServiceProviderEmployee'},
            'active_from': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'active_to': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'picture': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'picture_height': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True'}),
            'picture_width': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True'}),
            'service': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'employees'", 'to': u"orm['service.Service']"}),
            'service_provider': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'employees'", 'to': u"orm['accountext.ServiceProvider']"})
        },
        u'ServiceProviderEmployee.serviceprovideremployeeimage': {
            'Meta': {'object_name': 'ServiceProviderEmployeeImage'},
            'delete_image': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'image_height': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True'}),
            'image_width': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True'}),
            'service_provider': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['accountext.ServiceProvider']"})
        },
        u'accountext.category': {
            'Meta': {'object_name': 'Category'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'accountext.serviceprovider': {
            'Meta': {'object_name': 'ServiceProvider'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['accountext.Category']", 'null': 'True', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'country': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'gcal_id': ('django.db.models.fields.CharField', [], {'max_length': '128', 'null': 'True'}),
            'gcal_updated': ('django.db.models.fields.DateTimeField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lat': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'lng': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'logo_height': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True'}),
            'logo_width': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'reservation_confirmation_needed': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'street': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'subscription_end_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2014, 6, 4, 0, 0)'}),
            'subscription_mail_sent': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'timezone': ('django.db.models.fields.CharField', [], {'default': "'UTC'", 'max_length': '30'}),
            'web': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'zipcode': ('django.db.models.fields.CharField', [], {'max_length': '8', 'null': 'True', 'blank': 'True'})
        },
        u'service.category': {
            'Meta': {'object_name': 'Category'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'service.service': {
            'Meta': {'object_name': 'Service'},
            'active_until': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['service.Category']", 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'duration': ('django.db.models.fields.PositiveIntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'price': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '7', 'decimal_places': '2', 'blank': 'True'}),
            'service_provider': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'services'", 'to': u"orm['accountext.ServiceProvider']"}),
            'sex': ('django.db.models.fields.CharField', [], {'max_length': '1', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['ServiceProviderEmployee']