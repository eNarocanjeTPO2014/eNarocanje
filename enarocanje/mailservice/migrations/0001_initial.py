# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'MailService'
        db.create_table(u'mailservice_mailservice', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.TextField')(null=True)),
            ('message', self.gf('django.db.models.fields.TextField')(null=True)),
            ('date_time', self.gf('django.db.models.fields.DateField')()),
            ('mail_type', self.gf('django.db.models.fields.IntegerField')()),
            ('number_of_recipients', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('recipients', self.gf('django.db.models.fields.TextField')(null=True)),
            ('service_provider', self.gf('django.db.models.fields.related.ForeignKey')(default=0, to=orm['accountext.ServiceProvider'])),
        ))
        db.send_create_signal(u'mailservice', ['MailService'])

        # Adding model 'MailTemplateInfo'
        db.create_table(u'mailservice_mailtemplateinfo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=60)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True)),
            ('path', self.gf('django.db.models.fields.CharField')(max_length=60)),
        ))
        db.send_create_signal(u'mailservice', ['MailTemplateInfo'])

        # Adding model 'ProviderMailTemplate'
        db.create_table(u'mailservice_providermailtemplate', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('service_provider', self.gf('django.db.models.fields.related.ForeignKey')(default=0, to=orm['accountext.ServiceProvider'])),
            ('header_text', self.gf('django.db.models.fields.TextField')(null=True)),
            ('footer_text', self.gf('django.db.models.fields.TextField')(null=True)),
        ))
        db.send_create_signal(u'mailservice', ['ProviderMailTemplate'])


    def backwards(self, orm):
        # Deleting model 'MailService'
        db.delete_table(u'mailservice_mailservice')

        # Deleting model 'MailTemplateInfo'
        db.delete_table(u'mailservice_mailtemplateinfo')

        # Deleting model 'ProviderMailTemplate'
        db.delete_table(u'mailservice_providermailtemplate')


    models = {
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
            'reservation_confirmation_needed': ('django.db.models.fields.BooleanField', [], {}),
            'street': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'subscription_end_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2014, 6, 6, 0, 0)'}),
            'subscription_mail_sent': ('django.db.models.fields.BooleanField', [], {}),
            'timezone': ('django.db.models.fields.CharField', [], {'default': "'UTC'", 'max_length': '30'}),
            'web': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'zipcode': ('django.db.models.fields.CharField', [], {'max_length': '8', 'null': 'True', 'blank': 'True'})
        },
        u'mailservice.mailservice': {
            'Meta': {'object_name': 'MailService'},
            'date_time': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mail_type': ('django.db.models.fields.IntegerField', [], {}),
            'message': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'number_of_recipients': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'recipients': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'service_provider': ('django.db.models.fields.related.ForeignKey', [], {'default': '0', 'to': u"orm['accountext.ServiceProvider']"}),
            'title': ('django.db.models.fields.TextField', [], {'null': 'True'})
        },
        u'mailservice.mailtemplateinfo': {
            'Meta': {'object_name': 'MailTemplateInfo'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'path': ('django.db.models.fields.CharField', [], {'max_length': '60'})
        },
        u'mailservice.providermailtemplate': {
            'Meta': {'object_name': 'ProviderMailTemplate'},
            'footer_text': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'header_text': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'service_provider': ('django.db.models.fields.related.ForeignKey', [], {'default': '0', 'to': u"orm['accountext.ServiceProvider']"})
        }
    }

    complete_apps = ['mailservice']