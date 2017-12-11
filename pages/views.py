# coding: utf-8
from django.views.generic.base import TemplateView
from django.contrib.auth import authenticate, login, logout
from django.http.response import HttpResponseRedirect
from django.contrib import messages


class IndexView(TemplateView):
    template_name = 'pages/index.html'


class LoginView(TemplateView):
    template_name = 'pages/login.html'


class LogoutView(TemplateView):
    template_name = 'pages/login.html'

    def get(self, request, *args, **kwargs):
        logout(request)
        return super(LogoutView, self).get(request, *args, **kwargs)


class StockSearchView(TemplateView):
    template_name = 'pages/search.html'


class StockForecastByYearView(TemplateView):
    template_name = 'pages/forecast_year.html'


class StockForecastByReportView(TemplateView):
    template_name = 'pages/forecast_report.html'


class StockForecastMoreView(TemplateView):
    template_name = 'pages/forecast_more.html'


class StockForecastDiffView(TemplateView):
    template_name = 'pages/forecast_diff.html'
