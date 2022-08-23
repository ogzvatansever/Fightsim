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

class convertStats : # Converts character stats to in game stats

    def __init__(self,infighter) :
        self.crit = 0.1+0.02*infighter.agility
        self.dodge = 0.1+0.02*infighter.agility+0.01*infighter.stamina
        self.power = 0.5+0.1*infighter.strength
        self.defence = 0.04*infighter.toughness
        self.energy = 50+10*infighter.stamina
        self.hp = 100+10*infighter.health

    def stats(self) :
        print(self.crit,self.dodge,self.power,self.defence,self.energy,self.hp)

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