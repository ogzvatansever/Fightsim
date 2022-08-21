import random

# Will make a fighter database later

class Fighter :

    def __init__(self, nickname, agility, strength, stamina,) :
        self.nickname = nickname
        self.agility = 1.0 + agility
        self.strength = 1.0 + strength
        self.stamina = 1.0 + stamina

    def printStats(self):
        print(self.nickname,self.agility,self.strength,self.stamina)
