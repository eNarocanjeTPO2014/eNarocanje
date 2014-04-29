from django import forms
from django.forms import ModelForm
from django.utils.translation import ugettext_lazy as _
from models import Customer


class CustomerForm(ModelForm):

    """Form for adding and editing customers"""

    class Meta:
        model = Customer
        # all fields except full_name (backup field) and last_reservation
        exclude = ('full_name','last_reservation','service_provider' )

    def __init__(self, *args, **kwargs):
        super(CustomerForm, self).__init__(*args, **kwargs)
        self.fields['name'].label = _('First name: ')
        self.fields['last_name'].label = _('Last name: ')
        self.fields['email'].label = _('E-mail address: ')
        self.fields['phone'].label = _('Phone number: ')
