#!/usr/bin/python
# -*- coding: utf-8 -*-
from django import forms
from django.core.mail import send_mail
from django.conf import settings
from django.utils.translation import ugettext_lazy as _


class ContactForm(forms.Form):
    """
    Contact Form
    """
    name = forms.CharField(
        max_length=100,
        label=_('Name')
    )
    email = forms.EmailField(
        max_length=100,
        label=_('Email')
    )
    phone = forms.CharField(
        required=False,
        max_length=10,
        label=_('Phone')
    )
    message = forms.CharField(
        max_length=300,
        widget=forms.Textarea,
        label=_('Message')
    )
