import pdb
from allauth.account import app_settings
from allauth.account.utils import complete_signup, get_next_redirect_url
from allauth.account.views import SignupView
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ObjectDoesNotExist
from django.core.urlresolvers import reverse
from django.dispatch import receiver
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from enarocanje.ServiceProviderEmployee.forms import ServiceProviderEmployeeForm
from enarocanje.ServiceProviderEmployee.models import ServiceProviderEmployee
from enarocanje.service.forms import ServiceForm
from enarocanje.service.models import Service
from enarocanje.service.views import browse_providers

from forms import SignupForm, ServiceProviderForm, AddService
from models import User, ServiceProvider,ServiceProviderImage
from enarocanje.workinghours.models import WorkingHours

from django.utils.translation import ugettext as _

@login_required
def account_profile(request):

    if request.POST.get('action') == 'makeprovider' and not request.user.has_service_provider():
        request.user.service_provider = ServiceProvider.objects.create(name='Unnamed Service Provider')
        request.user.service_provider.save()
        request.user.save()
        return HttpResponseRedirect('')
    if request.POST.get('action') == 'removeprovider' and request.user.has_service_provider():
        service_provider = request.user.service_provider
        request.user.service_provider = None
        request.user.save()
        service_provider.delete()
        return HttpResponseRedirect('')

    initial = {
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'phone': request.user.phone,
        'language': request.user.language,
        'service_notifications': request.user.service_notifications,
        'service_reminder': request.user.send_reminders
    }

    if request.user.service_provider:
        lat = request.user.service_provider.lat
        lng = request.user.service_provider.lng

    if request.method == "POST":
        form = SignupForm(request.POST, initial=initial)
        service_provider_form = ServiceProviderForm(request.POST, request.FILES, instance=request.user.service_provider)
        if form.is_valid() and service_provider_form.is_valid():
            form.save(request.user)
            service_provider_form.save()
            request.session['django_language'] = request.user.language
            return HttpResponseRedirect('')
    else:
        form = SignupForm(initial=initial)
        service_provider_form = ServiceProviderForm(instance=request.user.service_provider)

    return render_to_response('account/profile.html', locals(), context_instance=RequestContext(request))

@receiver(user_logged_in)
def lang(sender, request, user, **kwargs):
    request.session['django_language'] = user.language

class SignupView2(SignupView):

    def get_success_url(self):

        # Explicitly passed ?next= URL takes precedence
        if self.request.POST.get('action') == 'singupprovider':
            return '/accounts/signup/provider/'
        else:
            ret = (get_next_redirect_url(self.request, self.redirect_field_name) or self.success_url)
            return ret

    def dispatch(self, request, *args, **kwargs):
        if 'referral' in request.GET:
            request.session['referral'] = request.GET['referral']
        return super(SignupView2, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        user = form.save(self.request)
        try:
            user.referral = User.objects.get(id=self.request.session['referral'])
        except KeyError:
            pass
        except ValueError:
            pass
        except ObjectDoesNotExist:
            pass
        user.save()

        return complete_signup(self.request, user, app_settings.EMAIL_VERIFICATION, self.get_success_url())

singup = SignupView2.as_view()

def providersignup(request):
    if request.method == 'POST':
        providerStep = request.POST.get('providerStep', '1')

        if providerStep == '1':
            form = ServiceProviderForm(request.POST)
            if form.is_valid():
                new_service_provider = ServiceProvider.objects.create()
                new_service_provider.name = request.POST.get('name', None)
                if request.POST.get('category', None) == u'':
                    new_service_provider.category = None
                else:
                     new_service_provider.category = request.POST.get('category', None)
                new_service_provider.city = request.POST.get('city', None)
                new_service_provider.country = request.POST.get('country', None)
                new_service_provider.street = request.POST.get('street', None)
                new_service_provider.zipcode = request.POST.get('zipcode', None)
                new_service_provider.timezone = request.POST.get('timezone', None)
                new_service_provider.logo = request.POST.get('logo', None)
                new_service_provider.send_email_reminder = request.POST.get('send_email_reminder', False)
                new_service_provider.send_sms_reminder = request.POST.get('send_sms_reminder', False)
                new_service_provider.reservation_confirmation_needed = request.POST.get('reservation_confirmation_needed', False)
                new_service_provider.web = request.POST.get('web', None)
                new_service_provider.save()


                request.user.service_provider = new_service_provider
                request.user.save()
                messages.success(request, _('Provider created successfully'))
                form = ServiceForm()
                return render_to_response('account/addservice.html', locals(), context_instance=RequestContext(request))
            else:
                messages.error(request, _('You must enter correct data!'))
                form = ServiceProviderForm()
                return render_to_response('account/singupprovider.html', locals(), context_instance=RequestContext(request))
        elif providerStep == '2':
            form = ServiceForm(request.POST)
            if request.POST.get('name', None) == u'' and request.POST.get('duration', None) == u'':
                form = ServiceProviderEmployeeForm()
                messages.warning(request, _('You did not add any service!'))
                return render_to_response('account/addemployee.html', locals(), context_instance=RequestContext(request))
            if form.is_valid():
                new_service = Service.objects.create(service_provider_id=request.user.service_provider_id, duration=request.POST.get('duration', None))

                new_service.name = request.POST.get('name', None)
                new_service.duration = request.POST.get('duration', None)
                new_service.description = request.POST.get('description', None)
                new_service.active_until = request.POST.get('active_until', None)
                new_service.price = request.POST.get('price', None)

                if request.POST.get('category', None) == u'':
                    new_service.category = None
                else:
                     new_service.category = request.POST.get('category', None)

                if request.POST.get('sex', None) == u'':
                    new_service.sex = None
                else:
                     new_service.sex = request.POST.get('sex', None)

                messages.success(request, _('Service '+new_service.name+' successfully added'))
                new_service.save()
            else:
                form = ServiceForm()
                return render_to_response('account/addservice.html', locals(), context_instance=RequestContext(request))

            if request.POST.get('action', '') == 'additionalservice':
                form = ServiceForm()
                return render_to_response('account/addservice.html', locals(), context_instance=RequestContext(request))
            else:
                form = ServiceProviderEmployeeForm()

                return render_to_response('account/addemployee.html', locals(), context_instance=RequestContext(request))
        elif providerStep == '3':
            form = ServiceProviderEmployeeForm(request.POST)
            if request.POST.get('description', None) == u'' and request.POST.get('first_name', None) == u'' and request.POST.get('last_name', None) == u'':
                messages.warning(request, _('You did not add any employee!'))
                return HttpResponseRedirect(reverse(browse_providers))

            new_employee = ServiceProviderEmployee.objects.create(first_name=request.POST.get('first_name', None), last_name=request.POST.get('last_name', None), service_provider=request.user.service_provider )
            new_employee.description = request.POST.get('description', None)
            new_employee.active_from = request.POST.get('active_from', None)
            new_employee.active_to = request.POST.get('active_to', None)
            new_employee.picture = request.POST.get('picture', None)
            new_employee.save()
            messages.success(request ,'Employee '+new_employee.first_name+' '+new_employee.last_name+' successfully added')
            if request.POST.get('action', '') == 'additionalemployee':
                form = ServiceProviderEmployeeForm()
                return render_to_response('account/addemployee.html', locals(), context_instance=RequestContext(request))
            else:
                return HttpResponseRedirect(reverse(browse_providers))

    else:
        form = ServiceProviderForm()

        return render_to_response('account/singupprovider.html', locals(), context_instance=RequestContext(request))




def ServiceProviderWeb(request, serviceProviderWeb):
    serviceProvider=0
    try:
        serviceProvider= ServiceProvider.objects.get(web=serviceProviderWeb)
    except  ObjectDoesNotExist:
        return render_to_response('404.html', locals(), context_instance=RequestContext(request))
        pass

    slika=""
    odpiralniCas=0
    staff=0
    try:
        staff= User.objects.get(service_provider_id = serviceProvider.id)
        delovniCasi= list(WorkingHours.objects.filter(service_provider_id = serviceProvider.id))
        slika= ServiceProviderImage.objects.get(service_provider_id = serviceProvider.id)
    except ObjectDoesNotExist:
        pass

    #Sestavi urnik
    urnik= [_('Closed'), _('Closed'), _('Closed'), _('Closed'), _('Closed'), _('Closed'), _('Closed')]
    for casi in delovniCasi:
        cas= casi.time_from.strftime("%H:%M") + " - " + casi.time_to.strftime("%H:%M")
        dnevi= [int(s) for s in casi.week_days if s.isdigit()]
        for i in dnevi:
            urnik[i-1]= cas

    return render_to_response('providerweb/webpage.html', locals(), context_instance=RequestContext(request))
