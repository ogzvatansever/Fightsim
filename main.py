import random
import sqlite3
import time
#import names
from flask import Flask, request, Response
#from flask_sqlalchemy import SQLAlchemy
#from sqlalchemy.orm import DeclarativeBase

#class Base(DeclarativeBase):
#  pass

#db = SQLAlchemy(model_class=Base)

app = Flask(__name__)

#app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"

#db.init_app(app)

from collections import namedtuple

def namedtuple_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    cls = namedtuple("Row", fields)
    return cls._make(row)

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

@app.post("/api/login")
def login():
    # This is a placeholder for the login logic
    # In a real application, you would check the credentials against a database
    # and return a token or session ID if successful
    # For now, we'll just return a success message
    con = sqlite3.connect("database.db")
    con.row_factory = dict_factory
    cur = con.cursor()
    cur.execute("SELECT * FROM User WHERE email = ?", (request.get_json().get("email"),))
    tempArray = cur.fetchone()
    if (tempArray) :
        return {
            "message": "Login successful!"
        }
    else :
        return Response(response="Failed", status=401)

@app.get("/api/fighter")
def fighters():
    con = sqlite3.connect("database.db")
    con.row_factory = dict_factory
    cur = con.cursor()
    cur.execute("SELECT * FROM Fighter")
    tempArray = cur.fetchall()
    return {"fighter": tempArray}

@app.get("/api/<email>/fighter")
def userFighter(email) :
    con = sqlite3.connect("database.db")
    con.row_factory = dict_factory
    cur = con.cursor()
    cur.execute("SELECT * FROM Fighter WHERE owner = ?", (email,))
    tempArray = cur.fetchall()
    if (tempArray) :
        return {"fighter": tempArray}
    else :
        return Response(response="Failed", status=404)

@app.get("/api/fighter/<nickname>")
def fighter(nickname) :
    con = sqlite3.connect("database.db")
    con.row_factory = dict_factory
    cur = con.cursor()
    cur.execute("SELECT * FROM Fighter WHERE nickname = ?", (nickname,))
    tempArray = cur.fetchone()
    if (tempArray) :
        return tempArray
    else :
        return Response(response="Failed", status=404)

@app.post("/api/fight")
def apiFight():
    con = sqlite3.connect("database.db")
    con.row_factory = dict_factory
    cur = con.cursor()
    cur.execute("SELECT * FROM Fighter WHERE nickname = ?", (request.get_json().get("fighter1"),))
    tempArray1 = cur.fetchone()
    print(tempArray1)
    cur.execute("SELECT * FROM Fighter WHERE nickname = ?", (request.get_json().get("fighter2"),))
    tempArray2 = cur.fetchone()
    print(tempArray2)
    if (tempArray1 and tempArray2) :
        fighter1 = Fighter(tempArray1.nickname, tempArray1.agility, tempArray1.strength, tempArray1.toughness, tempArray1.stamina, tempArray1.health, tempArray1[7])
        fighter2 = Fighter(tempArray2[1], tempArray2[2], tempArray2[3], tempArray2[4], tempArray2[5], tempArray2[6],tempArray2[7])
        simFight(fighter1, fighter2)
        return {"message": "Fight completed!"}
    else :
        return Response(response="Failed", status=404)

con = sqlite3.connect("database.db")
cur = con.cursor()

# Future Ideas
#
# Can split the record section the fighter database as Wins and Losses



#def db(param) :
#    global con, cur
#    if param == "o" or "O" :
#        con = sqlite3.connect("database.db")
#        cur = con.cursor()
#        #return con ; cur
#    elif param == "c" or "C" :
#        con.commit()
#        con.close()

def createTable() :
    #cur.execute("CREATE TABLE Nicknames (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname varchar, firstname varchar, lastname varchar, fullname varchar)")
    #cur.execute("DROP TABLE Nicknames")
    #cur.execute("DROP TABLE Fighter")
    #cur.execute("CREATE TABLE Fighter (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname varchar, agility int, strength int, toughness int, stamina int, health int, record varchar, star int)")
    con.commit()

class Fighter :

    def __init__(self, nickname, agility, strength, toughness, stamina, health, win=0, loss=0) :
        self.nickname = nickname
        self.agility = agility #
        self.strength = strength #
        self.toughness = toughness #
        self.stamina = stamina #
        self.health = health #
        self.win = win
        self.loss = loss 
        self.star = int((agility+strength+toughness+stamina+health) / 10)

    def printStats(self) :
        print (self.nickname,"Record:",self.win,"-",self.loss,self.star,"*","\n")
        print ("{:<11} {:<2} {:<10}".format('Agility:',self.agility,levelDisplay(self.agility)))
        print ("{:<11} {:<2} {:<10}".format("Strength:",self.strength,levelDisplay(self.strength)))
        print ("{:<11} {:<2} {:<10}".format("Toughness:",self.toughness,levelDisplay(self.toughness)))
        print ("{:<11} {:<2} {:<10}".format("Stamina:",self.stamina,levelDisplay(self.stamina)))
        print ("{:<11} {:<2} {:<10}".format("Health:",self.health,levelDisplay(self.health)))



class convertStats : # Converts character stats to in game stats

    def __init__(self,infighter) :
        self.nickname = infighter.nickname
        self.crit = 0.1+0.02*infighter.agility
        self.dodge = 0.1+0.02*infighter.agility+0.01*infighter.stamina
        self.power = 0.5+0.1*infighter.strength
        self.defence = 0.04*infighter.toughness
        self.energy = 50+10*infighter.stamina
        self.hp = 100+10*infighter.health
        self.win = infighter.win
        self.loss = infighter.loss

    def damage(self, hit, target) :
        if hit != 0 :
            target.hp -= hit
            print(target.nickname,"took", int(hit), "damage.")

    def stats(self) :
        return self.crit,self.dodge,self.power,self.defence,self.energy,self.hp



def createNickname() :
    if random.randint(1,2) == 1 :
        return f"The {random.choice(list(open('Nouns.txt'))).strip().capitalize()}"
    else :
        return f"The {random.choice(list(open('Adjectives.txt'))).strip().capitalize()} {random.choice(list(open('Nouns.txt'))).strip().capitalize()}"



def createFighterNickname(nickname = None) :
    names = "" # will fix this later
    if nickname is None :
        nickname = createNickname()
    out_nickname = f'{names.get_first_name()} "{nickname}" {names.get_last_name()}'
    cur.execute("SELECT EXISTS (SELECT 1 FROM Fighter WHERE nickname = ? LIMIT 1)", (out_nickname,))
    curcheck = cur.fetchone()
    if curcheck[0] == 1 :
        createFighterNickname(nickname)
    else :
        return out_nickname



def saveFighter(fighter) : #Creates a database entry for fighter
    cur.execute("INSERT INTO Fighter (nickname, agility, strength, toughness, stamina, health, star, win, loss) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",(fighter.nickname, fighter.agility, fighter.strength, fighter.toughness, fighter.stamina, fighter.health, fighter.star, fighter.win, fighter.loss))
    con.commit()



def updateFighter(fighter) :
    cur.execute("UPDATE Fighter SET nickname=?, agility=?, strength=?, toughness=?, stamina=?, health=?, win=?, loss=? WHERE nickname=?",(fighter.nickname, fighter.agility, fighter.strength, fighter.toughness, fighter.stamina, fighter.health, fighter.win, fighter.loss, fighter.nickname))
    con.commit()



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



# Can put the createStats function inside of this function it can be better that way
def createFighter(nickname) :
    temp_stats = createStats()
    return Fighter(nickname, temp_stats[0], temp_stats[1], temp_stats[2], temp_stats[3], temp_stats[4])



def createMultipleFighters(amount) :
    for i in range(1,amount+1) :
        saveFighter(createFighter(createFighterNickname()))



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
            print("Critical damage!")
            fighter2.energy -= 30
            return 10*2*fighter1.power
        
        else :
            dodge_cal = random.randint(1,100)
            if fighter2.dodge*100 >= dodge_cal :
                print(fighter2.nickname,"dodged the hit!")
                return 0
            
            else :
                block_cal = random.randint(1,100)
                if fighter2.defence*100 >= block_cal :
                    fighter2.energy += 15
                    print("Hit blocked!")
                    return 10*0.2*fighter1.power
                
                else :
                    fighter2.energy -= 5
                    return 10*fighter1.power

    else :
        print(fighter1.nickname,"resting")
        fighter1.energy += 15
        return 0



def simFight(tempfighter1, tempfighter2, sleep = 0) :
    fighter1 = convertStats(tempfighter1)
    fighter2 = convertStats(tempfighter2)
    turn_counter = 0
    outArray = []
    while fighter1.hp > 0 and fighter2.hp > 0 :
        turn_counter += 1
        fighter1.damage(calHit(fighter1, fighter2),fighter2)
        fighter1.energy += 5
        time.sleep(sleep)
        fighter2.damage(calHit(fighter2, fighter1),fighter1)
        fighter2.energy += 5
        time.sleep(sleep)

    print("\n")

    if fighter1.hp > fighter2.hp :
        tempfighter1.win += 1
        tempfighter2.loss += 1

        outArray.append(fighter1.nickname, "won the fight!")
    else:
        tempfighter2.win += 1
        tempfighter1.loss += 1

        outArray.append(fighter2.nickname, "won the fight!")
    
    updateFighter(tempfighter1)
    updateFighter(tempfighter2)
    outArray.append("The fight took", turn_counter, "turns.")
    return outArray



# Maybe i'll add multiple round fights later
def simRound() :
    pass

def pullFighter() :
    cur.execute("SELECT * FROM Fighter ORDER BY RANDOM() LIMIT 1")
    tempArray = cur.fetchall()
    return Fighter(tempArray[0][1], tempArray[0][2], tempArray[0][3], tempArray[0][4], tempArray[0][5], tempArray[0][6],tempArray[0][7])

if __name__ == "__main__" :
    pass
    #simFight(pullFighter(), pullFighter())