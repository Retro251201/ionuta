################################################################################
## LA PRINCIPESSA // tutto quello che si può aggiustare
################################################################################

## Splash iniziale (avvertenza come in Z.A.T.O.)
label splashscreen:
    if _lp_test:
        jump _lp_go
    if _lp_menushot:
        return
    scene bg nero_totale
    pause 0.6
    show text "{size=30}{color=#9a9a9a}ATTENZIONE{/color}{/size}\n\n{size=28}Questo gioco contiene rumori improvvisi, immagini lampeggianti,\nlinguaggio colorito e una nonna molto severa.{/size}" at truecenter with Dissolve(1.0)
    pause 4.0
    hide text with Dissolve(0.8)
    play sound s_statica
    show text "{size=34}{color=#d8d8d8}7.077 MHz{/color}{/size}" at truecenter with Dissolve(0.4)
    pause 1.6
    stop sound fadeout 0.8
    hide text with Dissolve(0.8)
    pause 0.4
    return

## musica del menu
define config.main_menu_music = audio.m_menu

label start:
    $ quick_menu = True
    call cap1
    call cap2
    call cap3
    call cap4
    call cap5
    call cap6
    call cap7
    call cap8
    call cap9
    call cap10
    call titoli_di_coda
    return

## Titoli di coda
label titoli_di_coda:
    window hide
    scene bg nero_totale with lentissimo
    play music m_finale fadein 2.0
    $ crediti = [
        "LA PRINCIPESSA\n// tutto quello che si può aggiustare",
        "IONUȚ\nnel ruolo di sé stesso, con molte maschere",
        "BABUSHKA VALYA\nValentina Petrovna Orlova\n(1942 — )",
        "RINO RUGGERI · DADO FERRARI\nGIULIA MARCHETTI · MARIO ESPOSITO\nARKADIJ ORLOV · MAX FIXER",
        "LEV ARKAD'EVIČ SOKOLOV\nche trasmise sui 7.077 MHz\nogni 31 dicembre",
        "Musiche: Kevin MacLeod (incompetech.com)\n\"Podmoskovnye vechera\" — Vladimir Troshin, 1956",
        "Effetti sonori: Freesound.org\nFont: Courier Prime",
        "Stile grafico ispirato a\nZ.A.T.O. // I Love the World and Everything In It",
        "Grazie per aver ascoltato.",
    ]
    $ _i = 0
    while _i < len(crediti):
        $ _t = crediti[_i]
        show text "{size=38}[_t]{/size}" at truecenter with Dissolve(1.2)
        pause 3.6
        hide text with Dissolve(1.0)
        $ _i += 1
    scene cg finale_radio with lentissimo
    pause 3.0
    show text "{size=44}{b}FINE{/b}{/size}" at truecenter with Dissolve(1.5)
    pause 4.0
    stop music fadeout 4.0
    scene bg nero_totale with lentissimo
    pause 1.0
    if _lp_test:
        $ renpy.quit()
    return
