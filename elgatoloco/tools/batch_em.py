"""Draw every picture emoji used by the game as a 3D sticker: RAW/<codepoints>.png, then ASSETS/em/<codepoints>.webp.

usage: python batch_em.py GAME_JS RAW_DIR ASSETS_EM_DIR [gen|cut|list] [codepoints ...]

The picture list is read from game.js itself, so new words get a drawing on the next run.
Symbols that are part of the interface (arrows, check marks, plain shapes) are left as text.
"""
import os, re, subprocess, sys, unicodedata, zlib

HERE = os.path.dirname(os.path.abspath(__file__))
STYLE = ("3D animated feature film style render, stylized chunky shapes, rich saturated colors, "
         "soft studio lighting, soft global illumination, professional casual game art, no text")
CUT = "single object, centered, whole object visible, isolated on a pure white seamless background, no ground shadow"
PAT = re.compile('(?:[\U0001F300-\U0001FAFF☀-➿⬀-⯿←-⇿⌀-⏿■-◿]️?'
                 '(?:‍[\U0001F300-\U0001FAFF☀-➿]️?)*)')

SKIP = """LEFTWARDS ARROW|RIGHTWARDS ARROW|BLACK RIGHT-POINTING TRIANGLE|BLACK CIRCLE|BLACK UP-POINTING TRIANGLE|BLACK SQUARE
WHITE HEAVY CHECK MARK|HEAVY CHECK MARK|ERASE TO THE LEFT|SPEAKER WITH THREE SOUND WAVES|SPEAKER WITH CANCELLATION STROKE
BLACK STAR|BLACK QUESTION MARK ORNAMENT|VIBRATION MODE|BLACK HEART SUIT|WHITE UP POINTING BACKHAND INDEX|LARGE RED CIRCLE
LARGE BLUE CIRCLE|UP-POINTING RED TRIANGLE|DASH SYMBOL|SPLASHING SWEAT SYMBOL|WHITE STAR""".replace("\n", "|").split("|")

ANIMALS = """FISH|BEAR|RABBIT|ELEPHANT|CAT|CHICKEN|HONEYBEE|BUTTERFLY|DOG|HORSE|DUCK|LION|FROG|TURTLE|PIG|MOUSE|DOLPHIN|SHARK|COW
MONKEY|GIRAFFE|ZEBRA|WHALE|CRAB|ANT|OWL|PENGUIN|TIGER|FOX|WOLF|SNAKE|OCTOPUS|EAGLE|PARROT|GOAT|SHEEP|DEER|HEDGEHOG|CROCODILE
LADY BEETLE|SPIDER|BAT|BUG|TROPICAL FISH|CHIPMUNK|SNAIL|FLAMINGO|RHINOCEROS|LEOPARD|MOSQUITO|SWAN|SEAL|HIPPOPOTAMUS|BIRD|RACCOON
TURKEY|SQUID|CRICKET|BOAR|PANDA|HAMSTER|BLOWFISH|LIZARD|DRAGON|BABY CHICK|BACTRIAN CAMEL|KANGAROO|LOBSTER|SHRIMP|KOALA|BADGER|RAM
LLAMA|BEAVER|BISON|BEETLE|SPOUTING WHALE|UNICORN""".replace("\n", "|").split("|")

# name -> what to draw (everything not listed here is drawn from its plain name)
SAY = {
    "SWAN": "an elegant adult white swan with a long curved neck and an orange beak, swimming, side view",
    "SHARK": "a cute grey shark with a white belly, side view, friendly smile, big shiny eyes",
    "WHITE MEDIUM STAR": "a glossy golden yellow five-pointed star, puffy rounded toy shape",
    "GLOWING STAR": "a glossy golden five-pointed star with a soft glow and a few tiny sparkles around it",
    "SPARKLES": "three shiny golden four-pointed sparkle stars of different sizes",
    "CRESCENT MOON": "a smooth yellow crescent moon, puffy toy shape",
    "CLOUD": "one fluffy white and light blue cumulus cloud, soft blue shading",
    "BLACK SUN WITH RAYS": "a happy round yellow sun with short chunky orange rays",
    "CHERRY BLOSSOM": "a pink cherry blossom flower with five petals",
    "TROPHY": "a shiny golden trophy cup with two handles",
    "TOP HAT": "a black magician top hat with a red band",
    "DECIDUOUS TREE": "a round leafy green tree with a brown trunk",
    "EVERGREEN TREE": "a green fir tree with a brown trunk",
    "PALM TREE": "a tropical palm tree with green leaves",
    "TANABATA TREE": "a green bamboo plant with leaves",
    "MOUNTAIN": "a grey rocky mountain with green foothills",
    "SNOW CAPPED MOUNTAIN": "a tall mountain with a white snowy peak",
    "VOLCANO": "a volcano with orange lava flowing from the top",
    "SAILBOAT": "a small sailboat with a white sail and a red hull",
    "SHIP": "a big cruise ship, white and red",
    "OPEN BOOK": "an open book with colourful pages",
    "GEM STONE": "a sparkling blue cut diamond gemstone",
    "LOCK": "a golden padlock, closed",
    "PURPLE HEART": "a glossy purple heart", "GREEN HEART": "a glossy green heart", "WHITE HEART": "a glossy pearl white heart with a thin grey outline",
    "HEAVY BLACK HEART": "a glossy red heart", "GROWING HEART": "a glossy pink heart with a smaller heart behind it",
    "SPARKLING HEART": "a glossy pink heart with tiny golden sparkles",
    "CHEESE WEDGE": "a wedge of yellow cheese with holes",
    "EGG": "one white chicken egg",
    "GLASS OF MILK": "a glass full of white milk",
    "HOUSE BUILDING": "a cosy little house with a red roof, a door and a window",
    "AUTOMOBILE": "a red toy car, side view",
    "AIRPLANE": "a white and blue passenger airplane",
    "STEAM LOCOMOTIVE": "a colourful toy steam locomotive train engine",
    "SOCCER BALL": "a classic black and white football",
    "WATER WAVE": "a curling blue ocean wave with white foam",
    "DESERT ISLAND": "a tiny sand island with one palm tree surrounded by blue water",
    "BEACH WITH UMBRELLA": "a patch of sandy beach with a striped beach umbrella",
    "DESERT": "desert sand dunes with a green cactus",
    "GRAPES": "a bunch of purple grapes with a green leaf",
    "KEY": "a golden key", "OLD KEY": "an old ornate bronze key",
    "CLOUD WITH RAIN": "a grey cloud with blue raindrops falling under it",
    "CLOUD WITH TORNADO": "a grey twisting tornado funnel",
    "RAINBOW": "a rainbow arch with a small white cloud at each end",
    "MUSHROOM": "a red mushroom with white dots",
    "ROCKET": "a red and white toy space rocket",
    "BED": "a child's bed with a blue blanket and a white pillow",
    "UMBRELLA": "an open purple umbrella", "UMBRELLA WITH RAIN DROPS": "an open blue umbrella with a few raindrops above it",
    "RAISED HAND": "a cartoon open hand palm waving, five fingers",
    "BREAD": "a loaf of golden bread",
    "SNOWFLAKE": "a light blue ice crystal snowflake",
    "EAR OF MAIZE": "a corn cob with yellow kernels and green husk",
    "EAR OF RICE": "a golden sheaf of wheat ears",
    "BUS": "a yellow school bus, side view", "MINIBUS": "a blue minibus van, side view",
    "DOOR": "a brown wooden door with a golden knob",
    "WRAPPED PRESENT": "a gift box wrapped in red paper with a golden ribbon bow",
    "CANDLE": "a lit white candle with a small flame", "DIYA LAMP": "a golden magic oil lamp",
    "GUITAR": "an acoustic guitar", "DRUM WITH DRUMSTICKS": "a red drum with two drumsticks",
    "WORLD MAP": "a rolled-out paper treasure map", "SEEDLING": "a small green sprout with two leaves growing from soil",
    "ROSE": "a red rose with a green stem", "HIGH VOLTAGE SIGN": "a yellow lightning bolt",
    "ICE CUBE": "one transparent light blue ice cube", "HERB": "a sprig of green leaves",
    "EUROPEAN CASTLE": "a small chunky medieval toy castle made of grey stone, two round towers with red cone roofs, a wooden gate and a little flag",
    "SMILING CAT FACE WITH HEART-SHAPED EYES": "the head of a happy cute black cat with heart-shaped pink eyes",
    "CAT FACE WITH TEARS OF JOY": "the head of a cute black cat laughing with eyes closed and happy tears",
    "COLLISION SYMBOL": "a comic book explosion burst, jagged spiky red, orange and yellow layers, no face",
    "ELECTRIC LIGHT BULB": "a glowing yellow light bulb", "STOPWATCH": "a stopwatch with a white dial",
    "TOOTH": "a clean white tooth", "MANS SHOE": "a brown leather shoe", "ATHLETIC SHOE": "a plain red running shoe with white laces and a white sole, no logo, no brand marks, side view",
    "TANGERINE": "an orange fruit with a green leaf", "PENCIL": "a yellow pencil with a pink eraser",
    "BALLOON": "a red party balloon with a string", "ALARM CLOCK": "a red alarm clock with two bells",
    "FIRE": "a cartoon campfire flame, orange and yellow", "SHORTCAKE": "a slice of strawberry cream cake",
    "COOKIE": "a chocolate chip cookie", "HONEY POT": "a clay pot full of golden honey with a wooden dipper",
    "SALT SHAKER": "a salt shaker", "MOBILE PHONE": "a smartphone with a colourful screen",
    "BELL": "a golden bell", "SCHOOL SATCHEL": "a red school backpack", "T-SHIRT": "a blue t-shirt",
    "SOCKS": "a pair of striped socks", "DRESS": "a pink dress", "GLOVES": "a pair of green knitted gloves",
    "SPOON": "a silver spoon", "CROWN": "a golden royal crown with red and blue gems",
    "LEAF FLUTTERING IN WIND": "two green leaves blown by the wind", "DROPLET": "one blue water drop",
    "TRACTOR": "a green farm tractor with big wheels", "COMET": "a glowing comet with a long blue and white tail",
    "BONE": "a white dog bone", "BLOSSOM": "a yellow flower with five petals", "SNOWMAN WITHOUT SNOW": "a snowman with a carrot nose, a scarf and a hat",
    "CRYSTAL BALL": "a purple crystal ball on a golden stand", "ROBOT FACE": "a friendly little toy robot",
    "SPIRAL SHELL": "a spiral seashell", "HIBISCUS": "a pink hibiscus flower", "LEDGER": "a yellow spiral notebook",
    "PAW PRINTS": "two cat paw prints, dark brown, soft pads", "CHEQUERED FLAG": "a black and white chequered racing flag on a pole",
    "DIRECT HIT": "a round red and white target with a dart in the bullseye", "GAME DIE": "one white dice with black dots",
    "NOSE": "a cartoon human nose", "MOUTH": "cartoon smiling red lips", "EYE": "one cartoon human eye with a brown iris",
    "EAR": "a cartoon human ear", "LEG": "a cartoon human leg with a foot",
    "BOY": "a happy cartoon little boy, head and shoulders", "GIRL": "a happy cartoon little girl with pigtails, head and shoulders",
    "MAN": "a friendly cartoon man, head and shoulders", "WOMAN": "a friendly cartoon woman, head and shoulders",
    "OLDER WOMAN": "a kind cartoon grandmother with grey hair and glasses, head and shoulders",
    "MAGE": "a cute cartoon wizard with a blue pointed hat and a white beard, full body",
    "BIRTHDAY CAKE": "a birthday cake with lit candles", "THUMBS UP SIGN": "a cartoon hand giving a thumbs up, green sleeve cuff",
    "THUMBS DOWN SIGN": "a cartoon hand giving a thumbs down, red sleeve cuff", "ABACUS": "a wooden abacus with colourful beads",
    "COCONUT": "a coconut cut in half", "COOKED RICE": "a bowl of white rice", "BEVERAGE BOX": "a juice box with a straw",
    "BOWL WITH SPOON": "a bowl of soup with a spoon", "POULTRY LEG": "a roasted chicken drumstick", "CHAIR": "a wooden chair",
    "BLACK SCISSORS": "a pair of scissors with red handles", "EYEGLASSES": "a pair of round glasses",
    "FORK AND KNIFE": "a silver fork and knife side by side", "FORK AND KNIFE WITH PLATE": "a white plate with a fork and a knife",
    "HAMMER": "a hammer with a wooden handle", "BROOM": "a straw broom", "CAMERA": "a photo camera", "RING": "a golden ring with a diamond",
    "PERSONAL COMPUTER": "a laptop computer", "HOT PEPPER": "a red chili pepper", "SCARF": "a red knitted scarf",
    "JEANS": "a pair of blue jeans", "MUSICAL KEYBOARD": "a small piano keyboard", "TRUMPET": "a golden trumpet", "VIOLIN": "a violin with a bow",
    "BASKETBALL AND HOOP": "an orange basketball", "TENNIS RACQUET AND BALL": "a tennis racket and a yellow tennis ball",
    "AMERICAN FOOTBALL": "a brown rugby ball", "VOLLEYBALL": "a white, blue and yellow volleyball",
    "CHOCOLATE BAR": "a chocolate bar partly unwrapped", "LOLLIPOP": "a swirl rainbow lollipop", "DOUGHNUT": "a donut with pink icing and sprinkles",
    "CHESTNUT": "one shiny dark brown chestnut nut with a pale round base, next to its open spiky green husk", "PEANUTS": "two peanuts in their shells", "LEAFY GREEN": "a head of green lettuce",
    "MEAT ON BONE": "a cartoon piece of roast meat on a bone", "SPIDER WEB": "a white spider web",
    "CONSTRUCTION SIGN": "a striped orange and white road barrier", "BRICK": "a small stack of red bricks",
    "BEAR FACE + SNOWFLAKE": "a cute white polar bear cub, full body, friendly smile, big shiny eyes",
    "GHOST": "a cute friendly white ghost", "DRAGON FACE": "a cute green baby dragon with small wings, full body, friendly smile",
    "DRAGON": "a cute red baby dragon with small wings, full body, friendly smile",
    "RINGED PLANET": "the planet Saturn with its rings", "EXTRATERRESTRIAL ALIEN": "a cute friendly little green alien, full body",
    "SPORTS MEDAL": "a gold medal on a blue and red ribbon", "GRADUATION CAP": "a black graduation cap with a golden tassel",
    "GEAR": "a grey metal cog wheel", "SMILING FACE WITH OPEN MOUTH AND TIGHTLY-CLOSED EYES": "a round yellow laughing smiley face",
    "FACE SAVOURING DELICIOUS FOOD": "a round yellow smiley face licking its lips", "BUBBLES": "three round translucent light blue soap bubbles with white shiny highlights and a faint rainbow sheen",
    "FOUR LEAF CLOVER": "a lucky green clover with exactly four heart-shaped leaves arranged in a cross, short stem", "MUSICAL NOTE": "a glossy blue musical note",
    "THIRD PLACE MEDAL": "a bronze medal with the number 3 on a ribbon", "SECOND PLACE MEDAL": "a silver medal with the number 2 on a ribbon",
    "FIRST PLACE MEDAL": "a gold medal with the number 1 on a ribbon", "VIDEO GAME": "a game controller",
    "LEFT-POINTING MAGNIFYING GLASS": "a magnifying glass", "TEDDY BEAR": "a brown teddy bear toy sitting",
    "KIWIFRUIT": "a kiwi fruit cut in half", "POT OF FOOD": "a cooking pot full of stew", "BATHTUB": "a white bathtub with foam",
    "GREEN APPLE": "a green apple", "RED APPLE": "a red apple with a green leaf", "CARROT": "an orange carrot with green leaves",
    "LEMON": "a yellow lemon", "BANANA": "a yellow banana", "PEAR": "a green pear", "TOMATO": "a red tomato", "CHERRIES": "two red cherries on a stem",
    "STRAWBERRY": "a red strawberry", "WATERMELON": "a slice of watermelon", "PEACH": "a peach with a leaf", "PINEAPPLE": "a pineapple",
    "ONION": "an onion", "POTATO": "a potato", "CUCUMBER": "a green cucumber", "BROCCOLI": "a broccoli floret",
    "BICYCLE": "a red bicycle, side view", "HELICOPTER": "a small red helicopter", "SUNFLOWER": "a sunflower",
    "LADY BEETLE": "a cute red ladybug with black dots, friendly smile, big shiny eyes",
    "BUG": "a cute green caterpillar, friendly smile, big shiny eyes", "CRICKET": "a green grasshopper insect with six legs, long folded hind legs, two long antennae and wings, side view, cute big shiny eyes",
    "BEETLE": "a cute stag beetle insect seen from above, shiny dark blue shell, six legs, two antlers, big shiny eyes", "HONEYBEE": "a cute striped honeybee flying, friendly smile, big shiny eyes",
    "TROPICAL FISH": "a cute yellow angelfish with black vertical stripes and tall fins, side view, friendly smile, big shiny eyes",
    "FISH": "a cute blue fish, side view, friendly smile, big shiny eyes", "BLOWFISH": "a cute round puffer fish with small spikes, friendly smile, big shiny eyes",
    "SPOUTING WHALE": "a cute blue whale spouting water from its blowhole, friendly smile",
    "WHALE": "a cute big blue whale, side view, friendly smile", "CAT": "a cute black cat with green eyes and a red collar, sitting, full body, friendly smile",
    "CHIPMUNK": "a cute squirrel with a bushy tail holding an acorn, full body, friendly smile, big shiny eyes",
    "BIRD": "a cute small blue songbird, full body, friendly smile, big shiny eyes", "BAT": "a cute bat with open wings, friendly smile, big shiny eyes",
    "RAM": "a cute ram with big curled horns, full body, friendly smile, big shiny eyes", "COW": "a cute black and white spotted cow, full body, friendly smile, big shiny eyes",
    "BACTRIAN CAMEL": "a cute camel with two humps, full body, friendly smile, big shiny eyes", "BABY CHICK": "a cute fluffy yellow baby chick, full body, big shiny eyes",
    "CHICKEN": "a cute white hen with a red comb, full body, big shiny eyes", "TURKEY": "a cute turkey bird with a fan tail, full body, big shiny eyes",
    "UNICORN": "a cute white unicorn with a rainbow mane and a golden horn, full body, friendly smile",
    "MOSQUITO": "a cute cartoon mosquito with a long thin nose and transparent wings, big shiny eyes",
    "ANT": "a cute cartoon ant with six legs, friendly smile, big shiny eyes", "SPIDER": "a cute friendly cartoon spider with eight legs, big shiny eyes",
}


def names(e):
    return " + ".join(unicodedata.name(c, "?") for c in e if c not in "️‍")


def key(e):
    return "-".join("%x" % ord(c) for c in e if c != "️")


def what(n):
    if n in SAY:
        return SAY[n]
    base = n.replace(" FACE", "")
    if base in SAY:
        return SAY[base]
    if base in ANIMALS:
        return "a cute baby %s, full body, friendly smile, big shiny eyes" % base.lower()
    return "a " + n.lower()


def main():
    js, raw, out = sys.argv[1:4]
    mode = sys.argv[4] if len(sys.argv) > 4 else "gen"
    only = sys.argv[5:]
    seen = {}
    for e in PAT.findall(open(js, encoding="utf-8").read()):
        n = names(e)
        if n not in SKIP and "?" not in n:
            seen.setdefault(key(e), n)
    os.makedirs(raw, exist_ok=True); os.makedirs(out, exist_ok=True)
    if mode == "list":
        for k, n in seen.items():
            print(k, "|", n, "|", what(n))
        return
    from post import cutout
    for k, n in seen.items():
        if only and k not in only:
            continue
        png = os.path.join(raw, k + ".png")
        if mode == "gen" and (only or not os.path.exists(png)):
            seed = zlib.crc32(k.encode()) % 100000 + (int(os.environ.get("RESEED", "0")))
            subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), png, "640", "640", str(seed),
                            "%s. %s. %s" % (what(n), CUT, STYLE)], check=True)
        if os.path.exists(png):
            try:
                cutout(png, os.path.join(out, k + ".webp"), 160)
            except Exception as err:
                print("CUT FAILED", k, n, err)
    print("done", len(seen))


if __name__ == "__main__":
    main()
