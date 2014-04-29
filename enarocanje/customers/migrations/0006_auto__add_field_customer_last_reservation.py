# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Customer.last_reservation'
        db.add_column(u'customers_customer', 'last_reservation',
                      self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime(2014, 4, 3, 0, 0), auto_now_add=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Customer.last_reservation'
        db.delete_column(u'customers_customer', 'last_reservation')


    models = {
        u'customers.customer': {
            'Meta': {'object_name': 'Customer'},
            'email': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True'}),
            'full_name': ('django.db.models.fields.CharField', [], {'max_length': '120', 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '60', 'null': 'True'}),
            'last_reservation': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2014, 4, 3, 0, 0)', 'auto_now_add': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '60', 'null': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True'})
        }
    }

    complete_apps = ['customers']