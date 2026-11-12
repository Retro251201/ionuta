################################################################################
## Personaggi — nome tra parentesi quadre come in Z.A.T.O.
################################################################################

define narrator = Character(None, what_color="#e9e9e9")

## Ionuț ha il ritratto nel box quando non è in scena come sprite
define i = Character("[[IONUȚ]", image="ionut")
define v = Character("[[VALYA]", image="valya")
define vg = Character("[[VALYA, 1968]", what_color="#efdcbc")
define r = Character("[[RINO]", image="rino")
define d = Character("[[DADO]", image="dado")
define g = Character("[[GIULIA]", image="giulia")
define m = Character("[[MARIO]", image="mario")
define a = Character("[[ARKADIJ]", image="arkadij")
define x = Character("[[MAX]", image="max")
define lev = Character("[[LEV]", what_color="#b8f0f4", what_italic=True)
define mamma = Character("[[MAMMA]", what_color="#ffd9c0")
define prof = Character("[[PROF.SSA BENASSI]")
define kevin = Character("[[KEVIN]")
define voce = Character("[[VOCE]", what_italic=True)
define tutti = Character("[[TUTTI]")
define infermiera = Character("[[INFERMIERA]")
define pubblico = Character("[[PUBBLICO]")

## il ritratto compare solo se Ionuț non è già in scena
define config.side_image_only_not_showing = True
define config.side_image_tag = None

## variabili delle scelte decorative
default scelta_bevanda = "te"
default scelta_pioggia = "ombrello"
default scelta_mamma = "verita"
