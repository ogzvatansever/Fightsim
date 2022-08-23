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

def createStats() : # This function creates stats for a fighter by choosing a number from 1-10 but it cannot exceed 40 total
    stats = [random.randint(1, 10),random.randint(1, 10),random.randint(1, 10),random.randint(1, 10),random.randint(1, 10)]
    while sum(stats) > 40 :
        for i in range(len(stats)) :
            if stats[i] > 1 :
                stats[i] -= 1
    return stats

def simFight(fighter1, fighter2) :
    pass

def simRound() :
    pass