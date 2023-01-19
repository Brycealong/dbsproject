from django.shortcuts import render

# Create your views here.
def index(request):
    views_name = "index"
    return render(request,"index.html")



