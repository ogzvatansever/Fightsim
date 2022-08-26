import random

# Will make a fighter database later

class Fighter :

    def __init__(self, nickname, agility, strength, toughness, stamina, health, record="0-0") :
        self.nickname = nickname
        self.agility = agility #
        self.strength = strength #
        self.toughness = toughness #
        self.stamina = stamina #
        self.health = health #
        self.record = record 
        self.star = int((agility+strength+toughness+stamina+health) / 10)

    def printStats(self) :
        print(self.nickname,self.record,self.agility,self.strength,self.toughness,self.stamina,self.health,self.star)



class convertStats : # Converts character stats to in game stats

    def __init__(self,infighter) :
        self.nickname = infighter.nickname
        self.crit = 0.1+0.02*infighter.agility
        self.dodge = 0.1+0.02*infighter.agility+0.01*infighter.stamina
        self.power = 0.5+0.1*infighter.strength
        self.defence = 0.04*infighter.toughness
        self.energy = 50+10*infighter.stamina
        self.hp = 100+10*infighter.health
        self.record = infighter.record

    def damage(self, hit, target) :
        target.hp -= hit
        print(target.nickname,"took", int(hit), "damage.")

    def stats(self) :
        return self.crit,self.dodge,self.power,self.defence,self.energy,self.hp



def createStats() : # This function creates stats for a fighter by choosing a number from 1-10 but it cannot exceed 40 total
    stats = [random.randint(1, 10),random.randint(1, 10),random.randint(1, 10),random.randint(1, 10),random.randint(1, 10)]
    while sum(stats) > 40 :
        for i in range(len(stats)) :
            if stats[i] > 1 :
                stats[i] -= 1
    return stats



def levelDisplay(inputstat) :
    tempvar = ""
    for i in range(0,inputstat) :
        tempvar += "*"
    return tempvar



def createFighter(nickname) :
    temp_stats = createStats()
    return Fighter(nickname, temp_stats[0], temp_stats[1], temp_stats[2], temp_stats[3], temp_stats[4])



def record(fighter,result) :
    turn = 0
    win = ""
    loss = ""
    for i in fighter.record :
        if i == "-" :
            turn += 1
            continue
        if turn == 0 :
            win += i
        else :
            loss += i
    
    if result == "w" :
        win = int(win)+1

    elif result == "l" :
        loss = int(loss)+1

    return str(win)+"-"+str(loss)



def calHit(fighter1,fighter2) :
    if fighter1.energy >= 10 :
        fighter1.energy -= 10

        crit_cal = random.randint(1,100)
        if fighter1.crit*100 >= crit_cal :
            fighter2.energy -= 30
            return 10*2*fighter1.power
        
        else :
            dodge_cal = random.randint(1,100)
            if fighter2.dodge >= dodge_cal :
                return 0
            
            else :
                block_cal = random.randint(1,100)
                if fighter2.defence >= block_cal :
                    fighter2.energy += 15
                    return 10*0.2*fighter1.power
                
                else :
                    fighter2.energy -= 5
                    return 10*fighter1.power

    else :
        fighter1.energy += 15
        return 0



def simFight(tempfighter1, tempfighter2) :
    fighter1 = convertStats(tempfighter1)
    fighter2 = convertStats(tempfighter2)
    turn_counter = 0
    while fighter1.hp >= 0 and fighter2.hp >= 0 :
        turn_counter += 1
        fighter1.damage(calHit(fighter1, fighter2),fighter2)
        fighter1.energy += 5
        fighter2.damage(calHit(fighter2, fighter1),fighter1)
        fighter2.energy += 5

    print("\n")

    if fighter1.hp > fighter2.hp :
        tempfighter1.record = record(tempfighter1,"w")
        tempfighter2.record = record(tempfighter2,"l")
        print(fighter1.nickname, "won the fight!")
    else:
        tempfighter2.record = record(tempfighter2,"w")
        tempfighter1.record = record(tempfighter1,"l")
        print(fighter2.nickname, "won the fight!")
    
    print("The fight took", turn_counter, "turns.")



def simRound() :
    pass



if __name__ == "__main__" :
    
    testfighter1 = createFighter("TestFighter1")
    testfighter2 = createFighter("TestFighter2")
    simFight(testfighter1,testfighter2)