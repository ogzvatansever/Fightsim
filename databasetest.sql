Table Fighter {
  id int PK
  agility int
  strength int
  toughness int
  stamina int
  health int
  record varchar
  star int
  fights int
}

Table Fight {
  id int PK
  fighter_id int
  winner_id int
}

Table Tournament {
  id int PK
  fighter_id int
  winner_id int
}