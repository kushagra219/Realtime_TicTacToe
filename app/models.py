from django.db import models


class Game(models.Model):
    room_code = models.CharField(max_length=6)
    game_creator = models.CharField(max_length=100)
    game_opponent = models.CharField(max_length=100, null=True, blank=True)
    is_over = models.BooleanField(default=False)

    def __str__(self):
        return self.room_code + " - " + self.game_creator


