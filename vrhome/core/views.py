# -*- coding: utf-8 -*-
import json
import requests
from django.shortcuts import render
from django.views.generic import View
from django.contrib import messages
from django.conf import settings
from django.shortcuts import redirect
from .forms import ContactForm

# Create your views here.


class HomeView(View):

    template_name = 'pages/home.html'

    def get(self, request):
        form = ContactForm()
        return render(
            request, self.template_name, {'form': form})

    def post(self, request):
        form = ContactForm(request.POST)
        if form.is_valid():
            message = 'Mensaje de: ' + form.cleaned_data['name'] + '\n'
            message += 'Email: ' + form.cleaned_data['email'] + '\n'
            if form.cleaned_data['phone']:
                message += 'Telefono: ' + form.cleaned_data['phone'] + '\n'
            message += 'Mensaje: ' + form.cleaned_data['message']

            headers = {'Content-Type': 'application/json'}
            payload = {
                'helpdesk_ticket': {
                    'subject': 'VRHOME| contact from ' +
                    form.cleaned_data['name'],
                    'description': message,
                    'email': form.cleaned_data['email'],
                    'priority': 3,
                    'status': 2
                },
                'cc_emails': 'support@swapps.io'
            }
            requests.post(
                settings.FRESHDESK_ENDPOINT + '/helpdesk/tickets.json',
                auth=(settings.FRESHDESK_KEY, "X"),
                headers=headers,
                data=json.dumps(payload),
                allow_redirects=False)

            messages.success(
                self.request,
                '¡Gracias por contactarnos! su mensaje ha sido enviado exitosamente. Nos pondremos en contacto con usted muy pronto.')
            return redirect('home')
        else:
            return render(
                request, self.template_name, {'form': form})
