################################################################################
## Schermate in stile Z.A.T.O.
################################################################################
init offset = -1

style default:
    font gui.text_font
    size gui.text_size
    color gui.text_color
    kerning 1.5
    language gui.language

style input:
    color "#ffffff"
    adjust_spacing False

style hyperlink_text:
    color "#ffffff"
    hover_color "#aaaaaa"
    hover_underline True

style gui_text:
    font gui.interface_text_font
    color gui.interface_text_color
    size gui.interface_text_size

style button:
    padding (6, 6, 6, 6)

style button_text is gui_text:
    color gui.idle_color
    hover_color gui.hover_color
    selected_color gui.selected_color
    insensitive_color gui.insensitive_color
    yalign 0.5

style label_text is gui_text:
    color "#ffffff"
    size gui.label_text_size

style prompt_text is gui_text:
    color gui.text_color
    size gui.interface_text_size

style bar:
    ysize gui.bar_size
    left_bar gui.bar_pieno
    right_bar gui.bar_vuoto

style vbar:
    xsize gui.bar_size
    top_bar gui.bar_vuoto
    bottom_bar gui.bar_pieno

style scrollbar:
    ysize gui.scrollbar_size
    base_bar Frame(Solid("#202020"))
    thumb Frame(Solid("#bbbbbb"))
    unscrollable "hide"

style vscrollbar:
    xsize gui.scrollbar_size
    base_bar Frame(Solid("#202020"))
    thumb Frame(Solid("#bbbbbb"))
    unscrollable "hide"

style slider:
    ysize gui.slider_size
    left_bar gui.bar_pieno
    right_bar gui.bar_vuoto
    thumb None

style vslider:
    xsize gui.slider_size
    top_bar gui.bar_vuoto
    bottom_bar gui.bar_pieno
    thumb None

style frame:
    padding (30, 30, 30, 30)
    background Frame("gui/box.png", 6, 6)


################################################################################
## Overlay: grana animata + scanlines (sempre visibili, come la pellicola di Z.A.T.O.)
################################################################################

image grana_anim:
    "images/ui/grana0.png"
    pause 0.06
    "images/ui/grana1.png"
    pause 0.06
    "images/ui/grana2.png"
    pause 0.06
    "images/ui/grana3.png"
    pause 0.06
    repeat

screen grana():
    zorder 200
    add "grana_anim" alpha 0.55
    add "images/ui/scanlines.png"

init python:
    config.overlay_screens.append("grana")


################################################################################
## Say
################################################################################

screen say(who, what):
    style_prefix "say"

    window:
        id "window"

        if who is not None:
            window:
                id "namebox"
                style "namebox"
                text who id "who"

        text what id "what"

    ## ritratto nel box di dialogo (come il riquadro del volto in Z.A.T.O.)
    if not renpy.variant("small"):
        add SideImage() xpos 1404 ypos 760

init python:
    config.character_id_prefixes.append('namebox')

style window is default
style say_label is default
style say_dialogue is default
style say_thought is say_dialogue
style namebox is default
style namebox_label is say_label

style window:
    xpos 226
    xsize 1470
    yalign 1.0
    ysize gui.textbox_height
    background Image("gui/textbox.png", xalign=0.0, yalign=1.0)

style namebox:
    xpos gui.name_xpos
    ypos gui.name_ypos
    ysize gui.namebox_height
    xminimum 190
    background Frame("gui/namebox.png", 4, 4)
    padding (34, 0, 34, 0)

style say_label:
    font gui.name_text_font
    size gui.name_text_size
    color "#f4f4f4"
    kerning 3
    yalign 0.5
    xalign 0.5

style say_dialogue:
    xpos gui.dialogue_xpos
    xsize gui.dialogue_width
    ypos gui.dialogue_ypos
    line_spacing 10
    adjust_spacing False


################################################################################
## Input
################################################################################

screen input(prompt):
    style_prefix "input"
    window:
        vbox:
            xpos gui.dialogue_xpos
            ypos gui.dialogue_ypos
            text prompt style "input_prompt"
            input id "input"

style input_prompt is default
style input:
    xmaximum gui.dialogue_width


################################################################################
## Scelte (riquadri centrati sul pannello)
################################################################################

screen choice(items):
    style_prefix "choice"
    vbox:
        for i in items:
            textbutton i.caption action i.action

style choice_vbox is vbox
style choice_button is button
style choice_button_text is button_text

style choice_vbox:
    xalign 0.5
    ypos 440
    yanchor 0.5
    spacing gui.choice_spacing

style choice_button:
    xsize 1000
    padding (40, 22, 40, 22)
    background Frame("gui/box_trasp.png", 4, 4)
    hover_background Frame("gui/box_hover.png", 4, 4)

style choice_button_text:
    xalign 0.5
    text_align 0.5
    size 34
    idle_color "#e6e6e6"
    hover_color "#000000"
    kerning 2


################################################################################
## Quick menu (riga in basso come in Z.A.T.O.)
################################################################################

screen quick_menu():
    zorder 100
    if quick_menu:
        hbox:
            style_prefix "quick"
            xalign 0.5
            yalign 0.995
            textbutton _("INDIETRO") action Rollback()
            textbutton _("LOG") action ShowMenu('history')
            textbutton _("SALTA") action Skip() alternate Skip(fast=True, confirm=True)
            textbutton _("AUTO") action Preference("auto-forward", "toggle")
            textbutton _("SALVA") action ShowMenu('save')
            textbutton _("Q.SALVA") action QuickSave()
            textbutton _("Q.CARICA") action QuickLoad()
            textbutton _("OPZIONI") action ShowMenu('preferences')

init python:
    config.overlay_screens.append("quick_menu")

default quick_menu = True

style quick_button is default
style quick_button_text is button_text

style quick_button:
    padding (14, 2, 14, 2)

style quick_button_text:
    size gui.quick_button_text_size
    idle_color "#8a8a8a"
    hover_color "#ffffff"
    selected_color "#ffffff"
    insensitive_color "#3a3a3a"
    kerning 1


################################################################################
## Navigazione
################################################################################

screen navigation():
    vbox:
        style_prefix "navigation"
        xpos gui.navigation_xpos
        yalign 0.62
        spacing gui.navigation_spacing

        if main_menu:
            textbutton _("[[ INIZIA ]") action Start()
        else:
            textbutton _("[[ CRONOLOGIA ]") action ShowMenu("history")
            textbutton _("[[ SALVA ]") action ShowMenu("save")

        textbutton _("[[ CARICA ]") action ShowMenu("load")
        textbutton _("[[ OPZIONI ]") action ShowMenu("preferences")

        if _in_replay:
            textbutton _("[[ FINE REPLAY ]") action EndReplay(confirm=True)
        elif not main_menu:
            textbutton _("[[ MENU PRINCIPALE ]") action MainMenu()

        textbutton _("[[ CREDITI ]") action ShowMenu("about")

        if renpy.variant("pc") or (renpy.variant("web") and not renpy.variant("mobile")):
            textbutton _("[[ COMANDI ]") action ShowMenu("help")

        if renpy.variant("pc"):
            textbutton _("[[ ESCI ]") action Quit(confirm=not main_menu)

style navigation_button is gui_button
style navigation_button_text is gui_button_text

style navigation_button:
    padding (0, 6, 0, 6)

style navigation_button_text:
    size 36
    idle_color "#9a9a9a"
    hover_color "#ffffff"
    selected_color "#ffffff"
    kerning 3


################################################################################
## Menu principale: sfondo che respira, logo con glitch
################################################################################

transform respiro:
    subpixel True
    zoom 1.04 xalign 0.5 yalign 0.5
    ease 14.0 zoom 1.09 xalign 0.6
    ease 14.0 zoom 1.04 xalign 0.5
    repeat

transform logo_glitch:
    alpha 1.0 xoffset 0
    pause 3.2
    xoffset 9 alpha 0.8
    pause 0.05
    xoffset -7
    pause 0.04
    xoffset 0 alpha 1.0
    pause 1.7
    alpha 0.6
    pause 0.04
    alpha 1.0
    repeat

image neve_menu:
    "images/ui/neve_full0.png"
    yoffset -1080
    linear 9.0 yoffset 0
    repeat

screen main_menu():
    tag menu
    add "images/ui/menu_bg.jpg" at respiro
    add "neve_menu" alpha 0.35
    add "neve_menu" alpha 0.25 xoffset 300 yoffset 540
    add "images/ui/vignetta.png"
    add "images/ui/logo.png" xpos 110 ypos 120 at logo_glitch
    text "Valdorsa, centro commerciale Il Girasole." xpos 132 ypos 380 size 26 color "#9a9a9a"
    use navigation
    text "v[config.version]" xalign 0.985 yalign 0.985 size 20 color "#555555"


################################################################################
## Menu di gioco
################################################################################

screen game_menu(title, scroll=None, yinitial=0.0, spacing=0):
    style_prefix "game_menu"
    if main_menu:
        add "images/ui/menu_bg.jpg" alpha 0.25
    else:
        add "images/ui/game_menu_bg.jpg"

    frame:
        style "game_menu_outer_frame"
        hbox:
            frame:
                style "game_menu_navigation_frame"
            frame:
                style "game_menu_content_frame"
                if scroll == "viewport":
                    viewport:
                        yinitial yinitial
                        scrollbars "vertical"
                        mousewheel True
                        draggable True
                        pagekeys True
                        side_yfill True
                        vbox:
                            spacing spacing
                            transclude
                elif scroll == "vpgrid":
                    vpgrid:
                        cols 1
                        yinitial yinitial
                        scrollbars "vertical"
                        mousewheel True
                        draggable True
                        pagekeys True
                        side_yfill True
                        spacing spacing
                        transclude
                else:
                    transclude

    use navigation

    textbutton _("[[ INDIETRO ]"):
        style "return_button"
        action Return()

    frame:
        style "game_menu_title_frame"
        text "[[[title]]" style "game_menu_label_text"

    if main_menu:
        key "game_menu" action ShowMenu("main_menu")

style game_menu_outer_frame is empty
style game_menu_navigation_frame is empty
style game_menu_content_frame is empty
style game_menu_viewport is gui_viewport
style game_menu_side is gui_side
style game_menu_scrollbar is gui_vscrollbar
style game_menu_label is gui_label
style game_menu_label_text is gui_label_text
style return_button is navigation_button
style return_button_text is navigation_button_text

style game_menu_outer_frame:
    bottom_padding 40
    top_padding 200
    background None

style game_menu_navigation_frame:
    xsize 520
    yfill True

style game_menu_content_frame:
    left_margin 40
    right_margin 60
    top_margin 10
    xfill True
    background Frame("gui/box_trasp.png", 4, 4)
    padding (40, 30, 30, 30)

style game_menu_viewport:
    xsize 1260

style game_menu_vscrollbar:
    unscrollable gui.unscrollable

style game_menu_side:
    spacing 10

style game_menu_title_frame:
    xpos 560
    ypos 100
    background Frame("gui/box.png", 4, 4)
    padding (34, 14, 34, 14)

style game_menu_label_text:
    size 42
    color "#ffffff"
    kerning 3

style return_button:
    xpos gui.navigation_xpos
    yalign 1.0
    yoffset -40


################################################################################
## About / crediti
################################################################################

screen about():
    tag menu
    use game_menu(_("CREDITI"), scroll="viewport"):
        style_prefix "about"
        vbox:
            spacing 16
            label "[config.name!t]"
            text _("Versione [config.version!t]")
            if gui.about:
                text "[gui.about!t]"
            text _("Realizzato con {a=https://www.renpy.org/}Ren'Py{/a} [renpy.version_only].")

style about_label is gui_label
style about_label_text is gui_label_text
style about_text is gui_text
style about_text:
    size 28
style about_label_text:
    size 44


################################################################################
## Salva / Carica
################################################################################

screen save():
    tag menu
    use file_slots(_("SALVA"))

screen load():
    tag menu
    use file_slots(_("CARICA"))

screen file_slots(title):
    default page_name_value = FilePageNameInputValue(pattern=_("Pagina {}"), auto=_("Salvataggi automatici"), quick=_("Salvataggi rapidi"))
    use game_menu(title):
        fixed:
            order_reverse True
            button:
                style "page_label"
                key_events True
                xalign 0.5
                action page_name_value.Toggle()
                input:
                    style "page_label_text"
                    value page_name_value

            grid gui.file_slot_cols gui.file_slot_rows:
                style_prefix "slot"
                xalign 0.5
                yalign 0.45
                spacing gui.slot_spacing
                for i in range(gui.file_slot_cols * gui.file_slot_rows):
                    $ slot = i + 1
                    button:
                        action FileAction(slot)
                        has vbox
                        add FileScreenshot(slot) xalign 0.5
                        text FileTime(slot, format=_("{#file_time}%d/%m/%Y  %H:%M"), empty=_("— vuoto —")):
                            style "slot_time_text"
                        text FileSaveName(slot):
                            style "slot_name_text"
                        key "save_delete" action FileDelete(slot)

            vbox:
                style_prefix "page"
                xalign 0.5
                yalign 1.0
                hbox:
                    xalign 0.5
                    spacing gui.page_spacing
                    textbutton _("<") action FilePagePrevious()
                    if config.has_autosave:
                        textbutton _("{#auto_page}A") action FilePage("auto")
                    if config.has_quicksave:
                        textbutton _("{#quick_page}Q") action FilePage("quick")
                    for page in range(1, 10):
                        textbutton "[page]" action FilePage(page)
                    textbutton _(">") action FilePageNext()

style page_label is gui_label
style page_label_text is gui_label_text
style page_button is gui_button
style page_button_text is gui_button_text
style slot_button is gui_button
style slot_button_text is gui_button_text
style slot_time_text is slot_button_text
style slot_name_text is slot_button_text

style page_label:
    xpadding 50
    ypadding 3
style page_label_text:
    text_align 0.5
    layout "subtitle"
    hover_color "#ffffff"
    size 30
style page_button:
    padding (16, 6, 16, 6)
style page_button_text:
    text_align 0.5
    idle_color "#8a8a8a"
    selected_color "#ffffff"
    hover_color "#ffffff"
style slot_button:
    xsize gui.slot_button_width
    ysize gui.slot_button_height
    padding (14, 14, 14, 14)
    background Frame("gui/box.png", 4, 4)
    hover_background Frame("gui/box_hover.png", 4, 4)
style slot_button_text:
    size gui.slot_button_text_size
    xalign 0.5
    idle_color "#9a9a9a"
    hover_color "#000000"


################################################################################
## Opzioni
################################################################################

screen preferences():
    tag menu
    use game_menu(_("OPZIONI"), scroll="viewport"):
        vbox:
            spacing 30
            hbox:
                box_wrap True
                spacing 60
                if renpy.variant("pc") or renpy.variant("web"):
                    vbox:
                        style_prefix "radio"
                        label _("Schermo")
                        textbutton _("Finestra") action Preference("display", "window")
                        textbutton _("Schermo intero") action Preference("display", "fullscreen")
                vbox:
                    style_prefix "check"
                    label _("Salta")
                    textbutton _("Testo non letto") action Preference("skip", "toggle")
                    textbutton _("Dopo le scelte") action Preference("after choices", "toggle")
                    textbutton _("Transizioni") action InvertSelected(Preference("transitions", "toggle"))
            hbox:
                style_prefix "slider"
                box_wrap True
                spacing 60
                vbox:
                    label _("Velocità testo")
                    bar value Preference("text speed")
                    label _("Avanzamento automatico")
                    bar value Preference("auto-forward time")
                vbox:
                    label _("Musica")
                    hbox:
                        bar value Preference("music volume")
                    label _("Effetti")
                    hbox:
                        bar value Preference("sound volume")
                        if config.sample_sound:
                            textbutton _("Prova") action Play("sound", config.sample_sound)
                    null height 20
                    textbutton _("Silenzia tutto"):
                        action Preference("all mute", "toggle")
                        style "mute_all_button"

style pref_label is gui_label
style pref_label_text is gui_label_text
style radio_label is pref_label
style radio_label_text is pref_label_text
style radio_button is gui_button
style radio_button_text is gui_button_text
style check_label is pref_label
style check_label_text is pref_label_text
style check_button is gui_button
style check_button_text is gui_button_text
style slider_label is pref_label
style slider_label_text is pref_label_text
style slider_slider is gui_slider
style slider_button is gui_button
style slider_button_text is gui_button_text
style mute_all_button is check_button
style mute_all_button_text is check_button_text

style pref_label_text:
    size 30
    color "#ffffff"
style radio_label_text:
    size 30
    color "#ffffff"
style check_label_text:
    size 30
    color "#ffffff"
style slider_label_text:
    size 30
    color "#ffffff"
style radio_button:
    padding (14, 4, 14, 4)
    selected_background Frame("gui/box.png", 4, 4)
style check_button:
    padding (14, 4, 14, 4)
    selected_background Frame("gui/box.png", 4, 4)
style mute_all_button:
    padding (14, 4, 14, 4)
    selected_background Frame("gui/box.png", 4, 4)
style slider_slider:
    xsize 520
style slider_vbox:
    xsize 600


################################################################################
## Cronologia
################################################################################

screen history():
    tag menu
    predict False
    use game_menu(_("CRONOLOGIA"), scroll=("vpgrid" if gui.history_height else "viewport"), yinitial=1.0, spacing=gui.history_spacing):
        style_prefix "history"
        for h in _history_list:
            window:
                has fixed:
                    yfit True
                if h.who:
                    label h.who:
                        style "history_name"
                        substitute False
                        if "color" in h.who_args:
                            text_color h.who_args["color"]
                $ what = renpy.filter_text_tags(h.what, allow=gui.history_allow_tags)
                text what:
                    substitute False
        if not _history_list:
            label _("Ancora niente da ricordare.")

define gui.history_allow_tags = { "alt", "noalt", "rt", "rb", "art", "b", "i" }

style history_window is empty
style history_name is gui_label
style history_name_text is gui_label_text
style history_text is gui_text
style history_label is gui_label
style history_label_text is gui_label_text

style history_window:
    xfill True
    ysize gui.history_height
style history_name:
    xpos gui.history_name_xpos
    xanchor 0.0
    ypos gui.history_name_ypos
    xsize gui.history_name_width
style history_name_text:
    min_width gui.history_name_width
    text_align 0.0
    size 26
    color "#ffffff"
style history_text:
    xpos 340
    ypos gui.history_text_ypos
    xanchor 0.0
    xsize 880
    min_width 880
    text_align 0.0
    size 26
    color "#cccccc"


################################################################################
## Comandi
################################################################################

screen help():
    tag menu
    use game_menu(_("COMANDI"), scroll="viewport"):
        style_prefix "help"
        vbox:
            spacing 18
            hbox:
                label _("Invio / Spazio / Clic")
                text _("Avanza")
            hbox:
                label _("Ctrl")
                text _("Salta (tieni premuto)")
            hbox:
                label _("Rotellina su / PagSu")
                text _("Torna indietro")
            hbox:
                label _("Tasto destro / Esc")
                text _("Menu")
            hbox:
                label _("H / tasto centrale")
                text _("Nascondi il box di testo")
            hbox:
                label _("S")
                text _("Screenshot")
            hbox:
                label _("F")
                text _("Schermo intero")

style help_label is gui_label
style help_label_text is gui_label_text
style help_text is gui_text
style help_label:
    xsize 520
    right_padding 30
style help_label_text:
    size 28
    xalign 1.0
    text_align 1.0
style help_text:
    size 28


################################################################################
## Conferma, skip, notify
################################################################################

screen confirm(message, yes_action, no_action):
    modal True
    zorder 200
    style_prefix "confirm"
    add Solid("#000000c0")
    frame:
        vbox:
            xalign .5
            yalign .5
            spacing 40
            label _(message):
                style "confirm_prompt"
                xalign 0.5
            hbox:
                xalign 0.5
                spacing 120
                textbutton _("[[ SÌ ]") action yes_action
                textbutton _("[[ NO ]") action no_action
    key "game_menu" action no_action

style confirm_frame is gui_frame
style confirm_prompt is gui_prompt
style confirm_prompt_text is gui_prompt_text
style confirm_button is gui_medium_button
style confirm_button_text is gui_medium_button_text
style confirm_frame:
    background Frame("gui/box.png", 4, 4)
    padding (70, 50, 70, 50)
    xalign .5
    yalign .5
style confirm_prompt_text:
    text_align 0.5
    layout "subtitle"
    size 32
style confirm_button_text:
    idle_color "#9a9a9a"
    hover_color "#ffffff"
    size 32

screen skip_indicator():
    zorder 100
    style_prefix "skip"
    frame:
        hbox:
            spacing 9
            text _(">> AVANTI VELOCE")

style skip_frame is empty
style skip_text is gui_text
style skip_frame:
    ypos gui.skip_ypos
    xpos 226
    background Frame("gui/box.png", 4, 4)
    padding (20, 6, 20, 6)
style skip_text:
    size 22

screen notify(message):
    zorder 100
    style_prefix "notify"
    frame at notify_appear:
        text "[message!tq]"
    timer 3.25 action Hide('notify')

transform notify_appear:
    on show:
        alpha 0
        linear .25 alpha 1.0
    on hide:
        linear .5 alpha 0.0

style notify_frame is empty
style notify_text is gui_text
style notify_frame:
    ypos gui.notify_ypos
    xpos 226
    background Frame("gui/box.png", 4, 4)
    padding (20, 8, 20, 8)
style notify_text:
    size gui.notify_text_size


################################################################################
## NVL (non usato, ma richiesto da Ren'Py)
################################################################################

screen nvl(dialogue, items=None):
    window:
        style "nvl_window"
        has vbox:
            spacing gui.nvl_spacing
        use nvl_dialogue(dialogue)
    for i in items or []:
        textbutton i.caption action i.action style "nvl_button"
    add SideImage() xalign 0.0 yalign 1.0

screen nvl_dialogue(dialogue):
    for d in dialogue:
        window:
            id d.window_id
            fixed:
                yfit gui.nvl_height is None
                if d.who is not None:
                    text d.who id d.who_id
                text d.what id d.what_id

define config.nvl_list_length = gui.nvl_list_length

style nvl_window is default
style nvl_entry is default
style nvl_label is say_label
style nvl_dialogue is say_dialogue
style nvl_button is button
style nvl_button_text is button_text
style nvl_window:
    xfill True
    yfill True
    background Solid("#000000d0")
    padding (0, 10, 0, 20)
style nvl_entry:
    xfill True
    ysize gui.nvl_height
style nvl_label:
    xpos gui.nvl_name_xpos
    xanchor 1.0
    ypos gui.nvl_name_ypos
    yanchor 0.0
    xsize gui.nvl_name_width
    min_width gui.nvl_name_width
    text_align 1.0
style nvl_dialogue:
    xpos gui.nvl_text_xpos
    xanchor 0.0
    ypos gui.nvl_text_ypos
    xsize gui.nvl_text_width
    min_width gui.nvl_text_width
    text_align 0.0
    layout "tex"
style nvl_button:
    xpos gui.nvl_button_xpos
    xanchor 0.0


################################################################################
## Bubble (richiesto dal template)
################################################################################

screen bubble(who, what):
    style_prefix "bubble"
    window:
        id "window"
        if who is not None:
            window:
                id "namebox"
                style "bubble_namebox"
                text who:
                    id "who"
        text what:
            id "what"

style bubble_window is empty
style bubble_namebox is empty
style bubble_who is default
style bubble_what is default
style bubble_window:
    xpadding 30
    top_padding 5
    bottom_padding 5
style bubble_namebox:
    xalign 0.5
style bubble_who:
    xalign 0.5
    textalign 0.5
    color "#000"
style bubble_what:
    align (0.5, 0.5)
    text_align 0.5
    layout "subtitle"
    color "#000"
