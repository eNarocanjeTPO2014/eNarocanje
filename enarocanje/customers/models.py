from datetime import datetime
from django.db import models
from django.utils.translation import ugettext_lazy as _

# Create your models here.
from enarocanje.accountext.models import ServiceProvider


class Customer(models.Model):

    """ Customer model - who is our customer which services they ordered """

    # NE POZABI VALIDACIJE!!!! (JS ali serverside)
    name = models.CharField(_('name'), max_length=60, null=True)
    last_name = models.CharField(_('last name'), max_length=60, null=True)
    phone = models.CharField(_('phone number'), max_length=100, null=True)
    email = models.CharField(_('email address'), max_length=100, null=True, unique=True)
    #field for optimized searching
    full_name = models.CharField(_('full name'), max_length=120, null=True)
    last_reservation = models.DateTimeField(null=True,default=datetime.today())
    number_of_reservations = models.IntegerField(null=True, default=0)
    # backup field when a service provider creates a customer with no reservations yet and it can be displayed
    service_provider = models.ForeignKey(ServiceProvider, null=True, default=None)

    def __unicode__(self):
        return unicode(str(self.name) + " " + str(self.last_name))
