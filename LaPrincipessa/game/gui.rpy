################################################################################
## GUI in stile Z.A.T.O.
################################################################################
init offset = -2

init python:
    gui.init(1920, 1080)

define config.check_conflicting_properties = True

## Colori
define gui.accent_color = "#ffffff"
define gui.idle_color = "#9a9a9a"
define gui.idle_small_color = "#8a8a8a"
define gui.hover_color = "#ffffff"
define gui.selected_color = "#ffffff"
define gui.insensitive_color = "#4a4a4a"
define gui.muted_color = "#3a3a3a"
define gui.hover_muted_color = "#6a6a6a"
define gui.text_color = "#f2f2f2"
define gui.interface_text_color = "#e6e6e6"
define gui.linea = "#d8d8d8"

## Font
define gui.text_font = "fonts/CourierPrime-Regular.ttf"
define gui.name_text_font = "fonts/CourierPrime-Regular.ttf"
define gui.interface_text_font = "fonts/CourierPrime-Regular.ttf"
define gui.bold_font = "fonts/CourierPrime-Bold.ttf"

define gui.text_size = 35
define gui.name_text_size = 42
define gui.interface_text_size = 30
define gui.label_text_size = 34
define gui.notify_text_size = 26
define gui.title_text_size = 60

## Textbox (come Z.A.T.O.: box nero sotto il pannello, aperto in basso)
define gui.textbox_height = 304
define gui.textbox_yalign = 1.0

define gui.name_xpos = 74
define gui.name_ypos = -64
define gui.name_xalign = 0.0
define gui.namebox_width = None
define gui.namebox_height = 96
define gui.namebox_borders = Borders(36, 10, 36, 10)
define gui.namebox_tile = False

define gui.dialogue_xpos = 176
define gui.dialogue_ypos = 72
define gui.dialogue_width = 1000
define gui.dialogue_text_xalign = 0.0

## Pulsanti
define gui.button_width = None
define gui.button_height = None
define gui.button_borders = Borders(6, 6, 6, 6)
define gui.button_tile = False
define gui.button_text_font = gui.interface_text_font
define gui.button_text_size = gui.interface_text_size
define gui.button_text_idle_color = gui.idle_color
define gui.button_text_hover_color = gui.hover_color
define gui.button_text_selected_color = gui.selected_color
define gui.button_text_insensitive_color = gui.insensitive_color
define gui.button_text_xalign = 0.0

define gui.quick_button_borders = Borders(14, 4, 14, 0)
define gui.quick_button_text_size = 22
define gui.quick_button_text_idle_color = "#8e8e8e"
define gui.quick_button_text_selected_color = gui.accent_color

define gui.page_button_borders = Borders(14, 6, 14, 6)
define gui.slot_button_width = 372
define gui.slot_button_height = 300
define gui.slot_button_borders = Borders(14, 14, 14, 14)
define gui.slot_button_text_size = 22
define gui.slot_button_text_xalign = 0.5
define gui.slot_button_text_idle_color = gui.idle_small_color
define gui.slot_button_text_selected_idle_color = gui.selected_color
define gui.slot_button_text_selected_hover_color = gui.hover_color

define config.thumbnail_width = 344
define config.thumbnail_height = 194
define gui.file_slot_cols = 3
define gui.file_slot_rows = 2

define gui.navigation_xpos = 120
define gui.skip_ypos = 20
define gui.notify_ypos = 60
define gui.choice_spacing = 26
define gui.navigation_spacing = 8
define gui.pref_spacing = 10
define gui.pref_button_spacing = 0
define gui.page_spacing = 0
define gui.slot_spacing = 20
define gui.main_menu_text_xalign = 0.0

define gui.frame_borders = Borders(6, 6, 6, 6)
define gui.confirm_frame_borders = Borders(60, 60, 60, 60)
define gui.skip_frame_borders = Borders(16, 5, 50, 5)
define gui.notify_frame_borders = Borders(16, 5, 40, 5)
define gui.frame_tile = False

define gui.bar_size = 26
define gui.scrollbar_size = 10
define gui.slider_size = 26
define gui.bar_tile = False
define gui.scrollbar_tile = False
define gui.slider_tile = False
define gui.bar_borders = Borders(2, 2, 2, 2)
define gui.scrollbar_borders = Borders(2, 2, 2, 2)
define gui.slider_borders = Borders(2, 2, 2, 2)
define gui.vbar_borders = Borders(2, 2, 2, 2)
define gui.vscrollbar_borders = Borders(2, 2, 2, 2)
define gui.vslider_borders = Borders(2, 2, 2, 2)
define gui.unscrollable = "hide"

define config.history_length = 250
define gui.history_height = None
define gui.history_spacing = 18
define gui.history_name_xpos = 60
define gui.history_name_ypos = 0
define gui.history_name_width = 300
define gui.history_name_xalign = 1.0
define gui.history_text_xpos = 400
define gui.history_text_ypos = 0
define gui.history_text_width = 1100
define gui.history_text_xalign = 0.0

define gui.nvl_borders = Borders(0, 10, 0, 20)
define gui.nvl_list_length = 6
define gui.nvl_height = 115
define gui.nvl_spacing = 10
define gui.nvl_name_xpos = 430
define gui.nvl_name_ypos = 0
define gui.nvl_name_width = 150
define gui.nvl_name_xalign = 1.0
define gui.nvl_text_xpos = 450
define gui.nvl_text_ypos = 8
define gui.nvl_text_width = 590
define gui.nvl_text_xalign = 0.0
define gui.nvl_thought_xpos = 240
define gui.nvl_thought_ypos = 0
define gui.nvl_thought_width = 780
define gui.nvl_thought_xalign = 0.0
define gui.nvl_button_xpos = 450
define gui.nvl_button_xalign = 0.0

define gui.language = "unicode"

## barre disegnate senza immagini
define gui.bar_pieno = Frame(Solid("#e8e8e8"), 0, 0)
define gui.bar_vuoto = Frame("gui/box.png", 2, 2)
