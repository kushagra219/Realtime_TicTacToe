from django.shortcuts import render, redirect
from django.contrib import messages
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext


@csrf_exempt
def home(request):
    if request.method == "POST":
        username = request.POST.get('username')
        option = request.POST.get('option')
        room_code = request.POST.get('room_code')
        
        if username == '' or option == 'Options' or room_code == '':
            messages.success(request, "Fill all the fields!")
            return redirect("/home/")

        if option == 'have-code':
            game = Game.objects.filter(room_code = room_code).first()
            print(game)

            if game is None:
                messages.success(request, "Room code not found!")
                return redirect("/home/")
            
            if game.is_over:
                messages.success(request, "Game is over")
                return redirect("/home/")
            
            if username != game.game_creator:
                game.game_opponent = username
                game.save()
            return redirect('/play/' + room_code + '/?username=' + username)

        else:
            game = Game(game_creator=username, room_code=room_code)
            game.save()
            return redirect('/play/' + room_code + '/?username=' + username)
            
    return render(request, 'home.html')


def play(request, room_code):
    username = request.GET.get('username')
    game_creator = Game.objects.get(room_code=room_code).game_creator
    is_creator = False
    if username == game_creator:
        is_creator = True
    context = {
        'room_code': room_code,
        'username': username,
        'is_creator': is_creator,
    }
    # print(room_code, username, is_creator)
    return render(request, 'play.html', context)


def handler404(request, exception):
    return render(request, '404.html')


def handler500(request):
    return render(request, '404.html')
