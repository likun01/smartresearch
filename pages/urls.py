# coding: utf-8
'''
Created on 2017年11月10日

@author: likun
'''
from django.conf.urls import url
from pages.views import LoginView, IndexView, StockSearchView, LogoutView

urlpatterns = (
    url(r'^login/$', LoginView.as_view(), name='pages_login'),
    url(r'^logout/$', LogoutView.as_view(), name='pages_logout'),
    url(r'^$', IndexView.as_view(), name='pages_index'),
    url(r'^search/$', StockSearchView.as_view(), name='pages_search'),
)
