from django.shortcuts import render

# Create your views here.
def user_chats(request):
    return render(request, "pages/user/chats.html", {})

