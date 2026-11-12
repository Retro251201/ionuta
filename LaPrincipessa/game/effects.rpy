################################################################################
## Posizioni, transizioni, effetti e piccole schermate di regia
################################################################################

## canale per i suoni d'ambiente in loop (pioggia, folla, statica...)
init python:
    renpy.music.register_channel("ambiente", "sfx", loop=True)

## --- Posizioni degli sprite (la base poggia sul bordo del box di testo) ---
## gli sprite hanno 304 px trasparenti sotto: con yalign 1.0 la base cade su y=776
transform zato_pos(x=0.5):
    xcenter x
    yalign 1.0

transform centro:
    zato_pos(0.5)
transform sx:
    zato_pos(0.31)
transform dx:
    zato_pos(0.69)
transform sx2:
    zato_pos(0.40)
transform dx2:
    zato_pos(0.60)
transform estrema_sx:
    zato_pos(0.22)
transform estrema_dx:
    zato_pos(0.78)

## primo piano (lo sprite cresce ed esce dal pannello, come i close-up di Z.A.T.O.)
transform primo_piano:
    xcenter 0.5 yalign 1.0
    easein 0.25 zoom 1.25 yoffset 380

## saltello comico
transform saltello:
    easein 0.08 yoffset -38
    easeout 0.10 yoffset 0
    easein 0.06 yoffset -14
    easeout 0.06 yoffset 0

## tremolio (paura, rabbia)
transform trema:
    linear 0.04 xoffset -5
    linear 0.04 xoffset 5
    repeat 8
    linear 0.04 xoffset 0

## entra/esce dai lati
transform entra_dx:
    xoffset 260 alpha 0.0
    easein 0.35 xoffset 0 alpha 1.0
transform entra_sx:
    xoffset -260 alpha 0.0
    easein 0.35 xoffset 0 alpha 1.0

## oggetti (radio, orologio...): al centro del pannello, leggero galleggiamento
transform oggetto:
    xcenter 0.5 ycenter 0.42
    on show:
        alpha 0.0 zoom 0.85
        easein 0.3 alpha 1.0 zoom 1.0
    on hide:
        easeout 0.25 alpha 0.0 zoom 0.9
    block:
        easein 2.2 yoffset -8
        easeout 2.2 yoffset 0
        repeat

## --- Transizioni ---
define flash = Fade(0.08, 0.0, 0.5, color="#ffffff")
define flash_rosso = Fade(0.08, 0.0, 0.5, color="#c4142b")
define flash_lungo = Fade(0.2, 0.3, 1.2, color="#ffffff")
define lento = Dissolve(1.5)
define lentissimo = Dissolve(3.0)
define buio = Fade(0.8, 0.6, 0.8)
define pixel = Pixellate(0.6, 6)
define taglio = None
define scivola = CropMove(0.6, "wipeleft")

## glitch: si usa con  "show layer master at glitch"  oppure  "with glitch_t"
transform glitch:
    xoffset 0
    linear 0.03 xoffset 22
    linear 0.03 xoffset -16
    linear 0.03 xoffset 8
    linear 0.03 xoffset 0

define glitch_t = MultipleTransition([False, Pixellate(0.12, 4), True, Pixellate(0.18, 3), True])

## scuotimenti
define shake = vpunch
define scossa = hpunch

## --- Overlay di atmosfera (si mostrano con: show pioggia / show neve / hide ...) ---
image pioggia:
    "images/ui/pioggia0.png"
    pause 0.08
    "images/ui/pioggia1.png"
    pause 0.08
    repeat

image neve:
    "images/ui/neve0.png"
    yoffset -1080
    linear 8.0 yoffset 0
    repeat

image neve_lenta:
    "images/ui/neve1.png"
    yoffset -1080
    linear 14.0 yoffset 0
    repeat

image vignetta = "images/ui/vignetta.png"
image lampo_bianco = "images/ui/flash.png"

## filtri di "ricordo" sul layer master (show layer master at ricordo / at normale)
transform ricordo:
    matrixcolor SepiaMatrix(tint=Color("#f0d8b0")) * BrightnessMatrix(-0.05)
transform normale:
    matrixcolor None
transform notte_blu:
    matrixcolor TintMatrix("#8aa4ff") * BrightnessMatrix(-0.08)

################################################################################
## Title card di capitolo (nero, testo a macchina, come Z.A.T.O.)
################################################################################

screen titolo_capitolo_scr(num, titolo, sotto):
    zorder 150
    add Solid("#000")
    vbox:
        xalign 0.5 yalign 0.45
        spacing 24
        text "CAPITOLO [num]" xalign 0.5 size 30 color "#8a8a8a" kerning 8 at fade_testo(0.2)
        frame:
            xalign 0.5
            background Frame("gui/box.png", 4, 4)
            padding (60, 26, 60, 26)
            text "[titolo]" size 64 color "#ffffff" kerning 4 slow_cps 18 at fade_testo(0.6)
        if sotto:
            text "[sotto]" xalign 0.5 size 28 color "#9a9a9a" at fade_testo(1.6)

transform fade_testo(d):
    alpha 0.0
    pause d
    linear 0.6 alpha 1.0

label titolo_capitolo(num, titolo, sotto=""):
    window hide
    stop music fadeout 1.5
    scene bg nero_totale with buio
    play sound s_glitch
    show screen titolo_capitolo_scr(num, titolo, sotto)
    with Dissolve(0.5)
    pause 4.0
    hide screen titolo_capitolo_scr
    with Dissolve(1.0)
    return

################################################################################
## Messaggi sul telefono (SMS / chat)
################################################################################

screen sms_scr(mittente, testo):
    zorder 120
    frame at sms_in:
        xalign 0.5 ypos 190
        xsize 760
        background Frame("gui/box.png", 4, 4)
        padding (34, 22, 34, 26)
        vbox:
            spacing 12
            hbox:
                spacing 16
                text "▮" size 26 color "#7ad4da"
                text "[mittente]" size 26 color "#7ad4da" kerning 3
            text "[testo]" size 30 color "#ffffff"

transform sms_in:
    on show:
        yoffset 40 alpha 0.0
        easein 0.25 yoffset 0 alpha 1.0
    on hide:
        easeout 0.2 alpha 0.0

label sms(mittente, testo):
    play sound s_notifica
    show screen sms_scr(mittente, testo)
    pause
    hide screen sms_scr
    return

################################################################################
## Didascalia di luogo/ora (in alto a sinistra del pannello)
################################################################################

screen didascalia_scr(testo):
    zorder 110
    frame at fade_testo(0.0):
        xpos 226 ypos 60
        background Frame("gui/box.png", 4, 4)
        padding (22, 8, 22, 8)
        text "[testo]" size 24 color "#d8d8d8" kerning 3

label didascalia(testo):
    show screen didascalia_scr(testo)
    return

label via_didascalia:
    hide screen didascalia_scr
    return
