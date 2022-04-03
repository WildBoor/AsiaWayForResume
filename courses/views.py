from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def courses_index(request):
    return render(request, "pages/courses/index.html", {})

def course(request):
    return render(request, "pages/courses/course.html", {})