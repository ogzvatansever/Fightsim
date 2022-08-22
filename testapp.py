import random

# Will make a fighter database later

class Fighter :

    def __init__(self, nickname, agility, strength, toughness, stamina, health) :
        self.nickname = nickname
        self.agility = agility #
        self.strength = strength #
        self.toughness = toughness #
        self.stamina = stamina #
        self.health = health #

    def printStats(self) :
        print(self.nickname,self.agility,self.strength,self.toughness,self.stamina)

def test() : # This function creates stats for a fighter
    stats = [random.randint(1, 10),random.randint(1, 10),random.randint(1, 10),random.randint(1, 10),random.randint(1, 10)]
    print(stats)

def simFight(fighter1, fighter2) :
    pass

def simRound() :
    pass