/* =============================================================================
 * CropAlert — script.js
 * Shared logic for all five pages (index, about, app, library, help).
 *
 * TABLE OF CONTENTS
 *   1. DISEASE DATA .............. 12 diseases, single source of truth
 *   2. QUESTION DATA ............. 6 weighted symptom questions per crop
 *   3. PREDICTION / SCORING ENGINE prototype AI/ML demonstration + swap point
 *   4. APP PAGE UI ............... crop selection, questions, results, history
 *   5. DISEASE LIBRARY UI ........ rendering, search and crop filtering
 *   6. SHARED UI ................. mobile navigation, footer year, data lists
 *
 * This file is plain JavaScript (no frameworks, no build step). It is loaded
 * with a normal <script src="script.js"></script> tag at the end of <body>
 * on every page, so the site works by simply opening index.html in a browser.
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 1. DISEASE DATA
 * Every disease is stored once here. The Disease Library page AND the
 * assessment results page both read from this object, so the information can
 * be maintained in a single place.
 * --------------------------------------------------------------------------- */

const CROPS = [
  {
    id: 'rice',
    name: 'Rice',
    scientific: 'Oryza sativa',
    tagline: 'Blast, sheath blight, bacterial leaf blight and tungro.',
    diseaseIds: ['rice-blast', 'rice-sheath-blight', 'rice-bacterial-blight', 'rice-tungro']
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientific: 'Solanum lycopersicum',
    tagline: 'Early blight, late blight, bacterial spot and Septoria leaf spot.',
    diseaseIds: ['tomato-early-blight', 'tomato-late-blight', 'tomato-bacterial-spot', 'tomato-septoria']
  },
  {
    id: 'potato',
    name: 'Potato',
    scientific: 'Solanum tuberosum',
    tagline: 'Late blight, early blight, bacterial wilt and black scurf.',
    diseaseIds: ['potato-late-blight', 'potato-early-blight', 'potato-bacterial-wilt', 'potato-black-scurf']
  }
];

/** The 12 diseases covered by the CropAlert prototype. */
const DISEASES = {
  /* ---------------------------- RICE ----------------------------------- */
  'rice-blast': {
    id: 'rice-blast',
    name: 'Rice Blast',
    crop: 'Rice',
    cropId: 'rice',
    causal: 'Fungus Magnaporthe oryzae (asexual stage Pyricularia oryzae)',
    summary: 'Spindle-shaped grey-centred leaf spots that can also rot nodes and panicle necks.',
    keySymptoms: [
      'Spindle- or diamond-shaped lesions with pointed ends',
      'Grey to whitish centre with a dark brown border',
      'Blackened node or panicle neck causing broken tillers and white heads'
    ],
    symptoms:
      'Spindle- or diamond-shaped lesions with pointed ends, a grey to whitish centre and a brown to dark brown border appear on the leaves. Lesions merge and kill entire leaves. When the fungus reaches the node or the neck of the panicle it blackens and weakens them, so tillers break and heads dry up as empty "white heads".',
    parts: 'Leaf blades and collars, leaf sheaths, culm nodes and the neck of the panicle.',
    conditions:
      'Relative humidity above 90% for 8–12 hours, long leaf wetness from dew or light rain, 25–28 °C, a dense canopy, high nitrogen rates and shallow or intermittent drainage.',
    management:
      'Plant resistant or tolerant varieties; apply a seed treatment and foliar fungicides (tricyclazole, azoxystrobin or pyraclostrobin products, following local label rates) as soon as the first lesions appear; balance nitrogen applications and irrigate so the canopy dries faster; remove heavily infected patches.',
    prevention:
      'Use certified resistant seed, split and limit nitrogen, avoid very dense spacing and continuous flooding, keep field debris and bunds clean, and synchronise planting so susceptible stages do not coincide with the wettest months.'
  },
  'rice-sheath-blight': {
    id: 'rice-sheath-blight',
    name: 'Rice Sheath Blight',
    crop: 'Rice',
    cropId: 'rice',
    causal: 'Fungus Rhizoctonia solani (mainly anastomosis group AG-1)',
    summary: 'Snake-skin lesions on lower leaf sheaths that climb the canopy in thick, humid crops.',
    keySymptoms: [
      'Irregular oval, water-soaked greyish-green patches low on the sheath',
      'Older lesions turn straw-coloured with a purple-brown edge and mosaic pattern',
      'Sheaths rot near the water line and patches of the canopy collapse'
    ],
    symptoms:
      'Irregular, oval to elongated, water-soaked greyish-green lesions form on the leaf sheath close to the water line. Older lesions become straw-coloured with a purple-brown border and a coarse "snake-skin" mosaic pattern. The disease moves up the canopy, sheaths rot, leaves die and panicles fill poorly.',
    parts: 'Leaf sheaths (lower ones first), then leaf blades, culms and panicles in severe cases.',
    conditions:
      '25–32 °C with humidity above 95% around the canopy base, a dense and heavily fertilised crop, continuous submergence, poor air movement and plentiful infected crop residue in the field.',
    management:
      'Space seedlings to open the canopy, reduce basal nitrogen and drain the field occasionally to lower humidity; apply effective fungicides (propiconazole, isoprothiolane, hexaconazole or trifloxystrobin products) at early sheath infection; remove or bury previous crop residue.',
    prevention:
      'Use lower planting density, resistant varieties where available, balanced fertilisation, alternate wetting and drying, clean fields after harvest and treated seed.'
  },
  'rice-bacterial-blight': {
    id: 'rice-bacterial-blight',
    name: 'Rice Bacterial Leaf Blight',
    crop: 'Rice',
    cropId: 'rice',
    causal: 'Bacterium Xanthomonas oryzae pv. oryzae',
    summary: 'Yellow-to-white streaks running from leaf tips and margins until leaves dry up.',
    keySymptoms: [
      'Water-soaked streaks starting at the leaf tip or margin',
      'Streaks turn yellow, then orange and finally whitish-grey with wavy edges',
      'Leaves roll and dry; seedlings may wilt completely (kresek)'
    ],
    symptoms:
      'Water-soaked streaks begin at the leaf tip or along the margin and extend downward, turning yellow, then orange and finally whitish-grey with wavy borders. Affected leaves roll, dry and die. In young seedlings the whole plant may wilt suddenly, a phase known as kresek.',
    parts: 'Leaf blades and margins, leaf sheaths and the whole seedling in the kresek phase.',
    conditions:
      '25–34 °C with high humidity, rain, hail or wind that wounds the leaves, flooding or splashing that spreads bacteria, high nitrogen, and use of infected seed or transplants.',
    management:
      'Plant resistant varieties and certified seed; drain fields promptly and avoid excess nitrogen; apply copper-based or streptomycin bactericides where these are permitted and labelled, at the first appearance of streaks; rogue and destroy badly infected hills.',
    prevention:
      'Use resistant varieties and clean seed, keep irrigation water and fields well drained, apply balanced fertiliser, disinfect tools and threshing equipment, and avoid working through the crop while it is wet.'
  },
  'rice-tungro': {
    id: 'rice-tungro',
    name: 'Rice Tungro',
    crop: 'Rice',
    cropId: 'rice',
    causal: 'Rice tungro bacilliform virus and rice tungro spherical virus, spread by the green leafhopper Nephotettix virescens',
    summary: 'Stunted, orange-yellow patches in the field carried by green leafhoppers.',
    keySymptoms: [
      'Stunted growth with clearly reduced tillers',
      'Older leaves turn orange-yellow from tip and base while younger leaves stay green',
      'Short, partly empty panicles with poorly filled grains'
    ],
    symptoms:
      'Infected hills are stunted and produce fewer tillers. Older leaves turn orange-yellow from the tip and base while younger leaves remain green, and leaves are often short and blunt. Panicles are short and grains fill poorly, giving chaffy heads. Symptoms appear in patches that follow leafhopper movement.',
    parts: 'Whole plant — leaves, tillers and grain filling are affected instead of distinct leaf spots.',
    conditions:
      'Presence of viruliferous green leafhoppers, warm weather around 25–30 °C, early planting near infected volunteers or ratoons, dense stands, and year-round cropping that keeps the vector alive.',
    management:
      'Control the green leafhopper with recommended insecticides or biological control when thresholds are reached; rogue and destroy infected hills early; use tungro-resistant or tolerant varieties; synchronise planting dates and manage volunteer plants.',
    prevention:
      'Plant resistant varieties, synchronise planting within a community, control leafhoppers early including in borders and ratoons, remove weed hosts, and grow repellent companion plants such as Gliricidia along field bunds.'
  },

  /* ---------------------------- TOMATO --------------------------------- */
  'tomato-early-blight': {
    id: 'tomato-early-blight',
    name: 'Tomato Early Blight',
    crop: 'Tomato',
    cropId: 'tomato',
    causal: 'Fungus Alternaria solani',
    summary: 'Target-ring brown spots on older leaves, stems and fruit that cause steady defoliation.',
    keySymptoms: [
      'Brown spots with concentric "target-board" rings and a yellow halo',
      'Starts on the oldest, lowest leaves and moves upward',
      'Ringed, sunken dark patches on stems and larger fruit'
    ],
    symptoms:
      'Dark brown spots with distinct concentric "target-board" rings appear first on older leaves, surrounded by a yellow halo. Stems and fruit develop similar ringed, sunken dark patches. Repeated defoliation weakens the plant and exposes fruit to sunscald.',
    parts: 'Older (lower) leaves first, then stems, petioles and fruit.',
    conditions:
      'Warm 24–29 °C with alternating wet and dry periods, humidity above 85% with heavy dew, splash from soil onto lower leaves, low nitrogen, and older or stressed plants.',
    management:
      'Remove and bag the lowest infected leaves; apply protectant or systemic fungicides (chlorothalonil, mancozeb, difenoconazole or azoxystrobin products) on a 7–14 day schedule, rotating modes of action to prevent resistance; mulch the soil to stop splash; keep fertilisation balanced and irrigate with drip lines.',
    prevention:
      'Rotate with non-solanaceous crops for 2–3 years, use certified seed and transplants, mulch and stake plants, remove crop debris after harvest, and avoid working in the crop while foliage is wet.'
  },
  'tomato-late-blight': {
    id: 'tomato-late-blight',
    name: 'Tomato Late Blight',
    crop: 'Tomato',
    cropId: 'tomato',
    causal: 'Oomycete Phytophthora infestans',
    summary: 'Fast-spreading water-soaked black blotches with white mould and greasy fruit rot.',
    keySymptoms: [
      'Large irregular dark green-black water-soaked blotches on any leaf',
      'White downy growth on the leaf underside in cool, humid weather',
      'Firm, greasy dark patches on fruit and dark lesions running down stems'
    ],
    symptoms:
      'Large, irregular, dark green-black water-soaked blotches spread quickly across leaves, often starting at tips or margins, with a pale green halo. A white downy growth appears on the leaf underside in cool, humid weather. Stems show dark lesions and fruit develop firm, greasy brown patches that soon rot.',
    parts: 'Leaves, stems, petioles and fruit (tubers too if potatoes are grown nearby).',
    conditions:
      'Cool and very moist conditions of 10–25 °C (optimum about 15–20 °C), humidity above 90% with leaf wetness or fog for long periods, dense foliage, and infected volunteers or cull piles nearby.',
    management:
      'Apply systemic plus protectant fungicides (mefenoxam or metalaxyl together with chlorothalonil or dimethomorph products) immediately and repeat at short intervals; remove and destroy infected plants; improve airflow with spacing and pruning; stop overhead irrigation.',
    prevention:
      'Use resistant varieties and certified seed or transplants, destroy volunteer plants and cull piles, keep the field free of weeds, water at soil level, and never compost diseased material.'
  },
  'tomato-bacterial-spot': {
    id: 'tomato-bacterial-spot',
    name: 'Tomato Bacterial Spot',
    crop: 'Tomato',
    cropId: 'tomato',
    causal: 'Bacteria of the genus Xanthomonas (X. vesicatoria, X. perforans, X. arboricola and others)',
    summary: 'Tiny angular black leaf spots with yellow halos and rough, scabby fruit.',
    keySymptoms: [
      'Small (1–3 mm), angular water-soaked dark brown to black spots',
      'Yellow halo around each spot; spots merge and leaves drop',
      'Raised, rough, scabbed dark specks on the fruit surface'
    ],
    symptoms:
      'Small (1–3 mm), angular, water-soaked dark brown to black leaf spots with a yellow halo appear on older foliage and may merge, causing leaves to fall. Fruit develop raised, rough, scabbed dark spots that crack and reduce marketability.',
    parts: 'Leaves, fruit and occasionally stems and petioles.',
    conditions:
      'Warm 25–30 °C with high humidity, splashing rain, overhead irrigation and wind-driven rain that wounds tissue, contaminated seed or transplants, and handling plants while they are wet.',
    management:
      'Apply copper-based bactericides with a sticker where allowed, starting at the first symptoms and repeating every 7–10 days; remove badly infected plants; improve spacing and airflow; switch to drip irrigation; replace or treat seed stock.',
    prevention:
      'Use certified pathogen-free seed and transplants, rotate 1–2 years with non-hosts, sanitise tools and trays, avoid overhead watering, and control weeds and volunteer solanaceous plants.'
  },
  'tomato-septoria': {
    id: 'tomato-septoria',
    name: 'Tomato Septoria Leaf Spot',
    crop: 'Tomato',
    cropId: 'tomato',
    causal: 'Fungus Septoria lycopersici',
    summary: 'Many tiny dark-bordered spots with black specks that strip the plant from the bottom up.',
    keySymptoms: [
      'Numerous small round spots with dark borders and tan-grey centres',
      'Tiny black pycnidia (specks) inside each spot',
      'Lower leaves yellow and drop, defoliating the plant from the base'
    ],
    symptoms:
      'Many small, circular spots with dark borders and tan to grey centres develop on older leaves, each containing tiny black pycnidia. Spotted leaves turn yellow and fall, defoliating the plant from the bottom up. Stems and fruit are rarely affected.',
    parts: 'Older lower leaves mainly; petioles and stems occasionally.',
    conditions:
      'Cool to mild temperatures of 20–25 °C with high humidity, frequent rain or splash from soil onto foliage, dense canopy, long leaf wetness, and infected crop debris left in the field.',
    management:
      'Pick off and destroy the lowest infected leaves; apply protectant fungicides (chlorothalonil, mancozeb, copper or boscalid products) every 7–10 days while conditions stay wet; mulch the soil to prevent splash; improve spacing and air circulation.',
    prevention:
      'Rotate for 2–3 years, remove and destroy all crop debris after harvest, use certified seed, stake and prune plants, water at soil level, and control weeds and volunteers.'
  },

  /* ---------------------------- POTATO --------------------------------- */
  'potato-late-blight': {
    id: 'potato-late-blight',
    name: 'Potato Late Blight',
    crop: 'Potato',
    cropId: 'potato',
    causal: 'Oomycete Phytophthora infestans',
    summary: 'Rapid blackening of foliage in cool wet weather plus firm reddish-brown tuber rot.',
    keySymptoms: [
      'Fast-spreading dark green-black water-soaked leaf blotches with a pale margin',
      'White downy growth beneath lesions on cool, wet mornings',
      'Firm, reddish-brown dry rot on tubers'
    ],
    symptoms:
      'Rapidly enlarging dark green to black water-soaked leaf lesions with a pale green or yellow margin appear, and white downy growth forms beneath them on cool, wet mornings. Stems become dark and brittle, haulms collapse, and tubers develop firm, reddish-brown dry rot that often turns secondary-rotted in store.',
    parts: 'Leaves, stems, haulms and tubers.',
    conditions:
      'Cool, wet weather of 10–22 °C with frequent rain, fog or heavy dew, humidity above 90% for long periods, prolonged leaf wetness, a dense canopy, and nearby infected volunteers or cull heaps.',
    management:
      'Apply systemic plus contact fungicides (mefenoxam or metalaxyl with chlorothalonil, mandipropamid or cyazofamid products) before conditions favour the disease and continue protectant sprays; destroy infected haulms and volunteers; improve drainage and airflow; lift tubers promptly in dry weather.',
    prevention:
      'Use certified seed and resistant varieties where available, destroy cull piles and volunteer plants, avoid dense planting, ridge up tubers, rotate with non-host crops, and store tubers cool and dry.'
  },
  'potato-early-blight': {
    id: 'potato-early-blight',
    name: 'Potato Early Blight',
    crop: 'Potato',
    cropId: 'potato',
    causal: 'Fungus Alternaria solani',
    summary: 'Concentric ring spots on older leaves that premature the vines and scab the tubers.',
    keySymptoms: [
      'Dark brown spots with concentric target rings on older leaves',
      'Yellowing and premature death of the lower canopy',
      'Shallow, dark, sunken, leathery patches on tubers'
    ],
    symptoms:
      'Dark brown spots with concentric target-like rings start on older leaves and are surrounded by yellowing; severe infection causes premature senescence of the vines. Stems and stolons show similar ringed lesions and tubers develop shallow, dark, sunken, leathery patches.',
    parts: 'Older lower leaves, stems, stolons and the tuber surface.',
    conditions:
      'Warm 20–30 °C with alternating wet and dry periods, high humidity, water or nutrient stress, low nitrogen, ageing or weakened plants, and infested crop debris remaining in the soil.',
    management:
      'Apply protectant or systemic fungicides (chlorothalonil, mancozeb, difenoconazole or benthiavalicarb products) at 7–10 day intervals from tuber initiation; maintain balanced nutrition and irrigation; remove old leaves and debris; harvest carefully to avoid tuber injury.',
    prevention:
      'Rotate for 3–4 years with non-solanaceous crops, plant certified seed, destroy crop residues, avoid water and nitrogen stress, space plants for airflow, and handle tubers gently.'
  },
  'potato-bacterial-wilt': {
    id: 'potato-bacterial-wilt',
    name: 'Potato Bacterial Wilt',
    crop: 'Potato',
    cropId: 'potato',
    causal: 'Bacterium Ralstonia solanacearum',
    summary: 'Whole plants wilt in the heat of the day and stems ooze a milky bacterial fluid.',
    keySymptoms: [
      'Sudden wilting of the whole plant during hot afternoons, at least recovering at night at first',
      'Lower leaves roll and turn greenish-yellow while stems stay green',
      'Milky bacterial ooze from a cut stem; tubers rot with a creamy interior'
    ],
    symptoms:
      'The whole plant wilts during hot afternoons, initially recovering overnight, then permanently; lower leaves roll and turn greenish-yellow while the stems stay green. Splitting the stem near the base shows a milky bacterial ooze. Tubers rot with a creamy, water-soaked interior.',
    parts: 'Whole plant (vascular system), stems, roots and tubers.',
    conditions:
      'Warm soil of 25–35 °C with high moisture and poor drainage, acidic to neutral soils, wounding by nematodes, insects or cultivation, contaminated tools, water and seed tubers, and continuous solanaceous cropping.',
    management:
      'Rogue and destroy infected plants together with the soil around their roots; improve drainage and avoid flooded or contaminated irrigation; rotate at least 4 years with non-hosts such as cereals, legumes or brassicas; use certified or hot-water treated seed; disinfect tools and equipment.',
    prevention:
      'Use certified seed tubers, test saved seed, avoid fields with a history of wilt, clean and disinfect machinery, control nematodes and soil-borne insects, use clean irrigation water, and never move infected soil between fields.'
  },
  'potato-black-scurf': {
    id: 'potato-black-scurf',
    name: 'Potato Black Scurf',
    crop: 'Potato',
    cropId: 'potato',
    causal: 'Fungus Rhizoctonia solani',
    summary: 'Black crusts on tubers ("dirt that will not wash off") plus stem cankers and loose skin.',
    keySymptoms: [
      'Hard black crusty sclerotia stuck to the tuber skin',
      'Dark sunken cankers on underground stems and stolons',
      'Loose skin, rolling leaves and premature death of the vines'
    ],
    symptoms:
      'Hard, black, crust-like sclerotia stick to the tuber skin — "dirt that will not wash off" — and become more raised later in storage. Underground stems develop dark, sunken cankers that cause loose skin, rolling leaves, premature vine death and misshapen tubers with growth cracks.',
    parts: 'Tuber skins, stems and stolons (roots occasionally).',
    conditions:
      'Cool to moderate soil of 15–25 °C that stays wet or heavy, deep planting, acidic soils, repeated potato cropping, low soil fertility, and use of home-saved or infested seed.',
    management:
      'Plant certified, clean seed; apply in-furrow or seed-piece fungicides (penthiopyrad, flutriafol or pencycuron where registered); improve drainage and soil structure; lift and remove debris promptly; sort infected tubers out of storage.',
    prevention:
      'Rotate five years or more with non-solanaceous crops, plant clean certified seed, adjust soil pH and fertility, avoid planting deeply into cold wet soil, clean machinery moving between fields, and destroy volunteers and debris.'
  }
};

/* ---------------------------------------------------------------------------
 * 2. QUESTION DATA (crop selection -> symptom questions)
 * Each crop has 6 multiple-choice questions. Every answer option carries a
 * `weights` map: how strongly that answer supports each disease of the crop.
 *   3 = strong supporting evidence, 1 = mild/overlapping evidence,
 *  -1 = evidence against that disease, (missing) = 0 = neutral.
 * The scoring engine below turns these weights into a ranked prediction.
 * --------------------------------------------------------------------------- */

const ASSESSMENTS = {
  rice: {
    cropId: 'rice',
    cropName: 'Rice',
    diseaseIds: ['rice-blast', 'rice-sheath-blight', 'rice-bacterial-blight', 'rice-tungro'],
    questions: [
      {
        id: 'r-q1',
        text: 'Where do the most obvious symptoms first appear?',
        options: [
          { id: 'r-q1-a', label: 'Leaf blades — spindle or diamond-shaped spots with grey centres and brown borders', weights: { 'rice-blast': 3, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 0, 'rice-tungro': -1 } },
          { id: 'r-q1-b', label: 'Lower leaf sheath at the water line — oval, water-soaked grey-green patches', weights: { 'rice-blast': 1, 'rice-sheath-blight': 3, 'rice-bacterial-blight': 1, 'rice-tungro': -1 } },
          { id: 'r-q1-c', label: 'Leaf tips and margins — water-soaked streaks that turn yellow, then whitish', weights: { 'rice-blast': 0, 'rice-sheath-blight': 0, 'rice-bacterial-blight': 3, 'rice-tungro': -1 } },
          { id: 'r-q1-d', label: 'The whole plant — stunted, with orange-yellow older leaves', weights: { 'rice-blast': -1, 'rice-sheath-blight': -1, 'rice-bacterial-blight': 1, 'rice-tungro': 3 } }
        ]
      },
      {
        id: 'r-q2',
        text: 'What do the individual lesions look like up close?',
        options: [
          { id: 'r-q2-a', label: 'Pointed spindle shape, whitish-grey centre, dark brown margin', weights: { 'rice-blast': 3, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 1, 'rice-tungro': -1 } },
          { id: 'r-q2-b', label: 'Oval, greenish-grey patches with a coarse "snake-skin" mosaic pattern', weights: { 'rice-blast': 1, 'rice-sheath-blight': 3, 'rice-bacterial-blight': 0, 'rice-tungro': -1 } },
          { id: 'r-q2-c', label: 'Long yellow-to-white streaks running along the veins and leaf margin', weights: { 'rice-blast': 1, 'rice-sheath-blight': 0, 'rice-bacterial-blight': 3, 'rice-tungro': -1 } },
          { id: 'r-q2-d', label: 'No distinct spots — leaves are uniformly orange-yellow and rolled', weights: { 'rice-blast': -1, 'rice-sheath-blight': -1, 'rice-bacterial-blight': 0, 'rice-tungro': 3 } }
        ]
      },
      {
        id: 'r-q3',
        text: 'Viewed from a distance, what does the affected crop look like?',
        options: [
          { id: 'r-q3-a', label: 'Scattered grey-white spots across the canopy; plants otherwise stand normally', weights: { 'rice-blast': 3, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 1, 'rice-tungro': -1 } },
          { id: 'r-q3-b', label: 'Irregular patches drying out from the leaf tips and margins; leaves hang and roll', weights: { 'rice-blast': 1, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 3, 'rice-tungro': -1 } },
          { id: 'r-q3-c', label: 'Blotchy collapse starting at the base of the hills; sheaths rot and patches lodge', weights: { 'rice-blast': 1, 'rice-sheath-blight': 3, 'rice-bacterial-blight': 1, 'rice-tungro': -1 } },
          { id: 'r-q3-d', label: 'Uniformly short, bushy, orange patches; tillers are clearly reduced', weights: { 'rice-blast': -1, 'rice-sheath-blight': -1, 'rice-bacterial-blight': -1, 'rice-tungro': 3 } }
        ]
      },
      {
        id: 'r-q4',
        text: 'What were conditions or observations in the one to two weeks before symptoms appeared?',
        options: [
          { id: 'r-q4-a', label: 'Long spells of dew and mist, cool nights, leaves wet for many hours', weights: { 'rice-blast': 3, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 1, 'rice-tungro': 0 } },
          { id: 'r-q4-b', label: 'Stormy, warm, rainy weather; leaves damaged by wind or hail', weights: { 'rice-blast': 1, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 3, 'rice-tungro': 1 } },
          { id: 'r-q4-c', label: 'Hot and humid, dense heavily fertilised crop standing in water', weights: { 'rice-blast': 1, 'rice-sheath-blight': 3, 'rice-bacterial-blight': 1, 'rice-tungro': 1 } },
          { id: 'r-q4-d', label: 'Large numbers of green leafhoppers seen moving through the crop', weights: { 'rice-blast': 0, 'rice-sheath-blight': 0, 'rice-bacterial-blight': 0, 'rice-tungro': 3 } }
        ]
      },
      {
        id: 'r-q5',
        text: 'Is there any damage on the sheaths, stems or panicles?',
        options: [
          { id: 'r-q5-a', label: 'Greyish mouldy lesions with a snake-skin pattern low on the sheath', weights: { 'rice-blast': 1, 'rice-sheath-blight': 3, 'rice-bacterial-blight': 1, 'rice-tungro': -1 } },
          { id: 'r-q5-b', label: 'Nodes or the panicle neck blackened; tillers break and heads turn white', weights: { 'rice-blast': 3, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 0, 'rice-tungro': 0 } },
          { id: 'r-q5-c', label: 'Sheaths pale yellow to greyish-white and water-soaked along the midrib', weights: { 'rice-blast': 1, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 3, 'rice-tungro': -1 } },
          { id: 'r-q5-d', label: 'Panicles short and partly empty; grains small and discoloured', weights: { 'rice-blast': 1, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 0, 'rice-tungro': 3 } }
        ]
      },
      {
        id: 'r-q6',
        text: 'How has the damage been spreading?',
        options: [
          { id: 'r-q6-a', label: 'Spots enlarge fast in humid weather; whole leaves dry out within days', weights: { 'rice-blast': 3, 'rice-sheath-blight': 1, 'rice-bacterial-blight': 1, 'rice-tungro': -1 } },
          { id: 'r-q6-b', label: 'Streaks run the length of the leaf; affected leaves roll, dry and die rapidly', weights: { 'rice-blast': 1, 'rice-sheath-blight': 0, 'rice-bacterial-blight': 3, 'rice-tungro': -1 } },
          { id: 'r-q6-c', label: 'Damage builds up slowly from the base upward as the crop ages', weights: { 'rice-blast': 1, 'rice-sheath-blight': 3, 'rice-bacterial-blight': 1, 'rice-tungro': -1 } },
          { id: 'r-q6-d', label: 'Stunting appears within 1–2 weeks of leafhopper activity and does not recover', weights: { 'rice-blast': -1, 'rice-sheath-blight': -1, 'rice-bacterial-blight': -1, 'rice-tungro': 3 } }
        ]
      }
    ]
  },

  tomato: {
    cropId: 'tomato',
    cropName: 'Tomato',
    diseaseIds: ['tomato-early-blight', 'tomato-late-blight', 'tomato-bacterial-spot', 'tomato-septoria'],
    questions: [
      {
        id: 't-q1',
        text: 'Where do symptoms first appear on the plant?',
        options: [
          { id: 't-q1-a', label: 'Oldest, lowest leaves — small brown spots that spread and cause yellowing', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 1, 'tomato-septoria': 3 } },
          { id: 't-q1-b', label: 'Any leaf, often from the tips or edges — large dark water-soaked patches', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': 3, 'tomato-bacterial-spot': 1, 'tomato-septoria': 0 } },
          { id: 't-q1-c', label: 'Lower leaves with target-ring spots, later followed by similar spots on stems', weights: { 'tomato-early-blight': 3, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 0, 'tomato-septoria': 1 } },
          { id: 't-q1-d', label: 'Younger leaves and fruit — small angular water-soaked specks', weights: { 'tomato-early-blight': 0, 'tomato-late-blight': 2, 'tomato-bacterial-spot': 3, 'tomato-septoria': 0 } }
        ]
      },
      {
        id: 't-q2',
        text: 'Describe a typical individual spot.',
        options: [
          { id: 't-q2-a', label: 'Small (1–3 mm), angular, dark brown to black, edged with yellow', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': 0, 'tomato-bacterial-spot': 3, 'tomato-septoria': 2 } },
          { id: 't-q2-b', label: 'Small round spot, dark border, grey-tan centre with tiny black specks', weights: { 'tomato-early-blight': 2, 'tomato-late-blight': -1, 'tomato-bacterial-spot': 1, 'tomato-septoria': 3 } },
          { id: 't-q2-c', label: 'Large irregular dark green-black blotch, water-soaked, no defined centre', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': 3, 'tomato-bacterial-spot': 1, 'tomato-septoria': -1 } },
          { id: 't-q2-d', label: 'Brown spot with concentric target rings and a yellow halo', weights: { 'tomato-early-blight': 3, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 1, 'tomato-septoria': 1 } }
        ]
      },
      {
        id: 't-q3',
        text: 'Is there any mould or fuzzy growth on the leaves?',
        options: [
          { id: 't-q3-a', label: 'Yes — white downy growth on the leaf underside on cool, damp mornings', weights: { 'tomato-early-blight': -1, 'tomato-late-blight': 3, 'tomato-bacterial-spot': -1, 'tomato-septoria': -1 } },
          { id: 't-q3-b', label: 'No mould; spots have a grey centre containing tiny black pycnidia', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': -1, 'tomato-bacterial-spot': 1, 'tomato-septoria': 3 } },
          { id: 't-q3-c', label: 'No mould; tissue looks water-soaked first, then dry and scabby', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': -1, 'tomato-bacterial-spot': 3, 'tomato-septoria': 1 } },
          { id: 't-q3-d', label: 'No mould; older leaves simply yellow around ringed brown patches', weights: { 'tomato-early-blight': 3, 'tomato-late-blight': -1, 'tomato-bacterial-spot': 0, 'tomato-septoria': 1 } }
        ]
      },
      {
        id: 't-q4',
        text: 'How is the fruit affected?',
        options: [
          { id: 't-q4-a', label: 'Firm, greasy, dark patches that spread quickly, sometimes with white edges', weights: { 'tomato-early-blight': -1, 'tomato-late-blight': 3, 'tomato-bacterial-spot': -1, 'tomato-septoria': -1 } },
          { id: 't-q4-b', label: 'Raised, rough, scabbed dark specks; fruit looks pitted and uneven', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': -1, 'tomato-bacterial-spot': 3, 'tomato-septoria': -1 } },
          { id: 't-q4-c', label: 'Dark, firm, sunken patch with concentric rings on older fruit', weights: { 'tomato-early-blight': 3, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 1, 'tomato-septoria': -1 } },
          { id: 't-q4-d', label: 'Fruit is essentially unaffected — the damage stays on the leaves', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': -1, 'tomato-bacterial-spot': -1, 'tomato-septoria': 3 } }
        ]
      },
      {
        id: 't-q5',
        text: 'What were the weather and field conditions before symptoms appeared?',
        options: [
          { id: 't-q5-a', label: 'Cool (15–25 °C) and very wet — frequent rain, fog or long leaf wetness', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': 3, 'tomato-bacterial-spot': 1, 'tomato-septoria': 1 } },
          { id: 't-q5-b', label: 'Warm and humid with alternating wet and dry days and plenty of dew', weights: { 'tomato-early-blight': 3, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 1, 'tomato-septoria': 2 } },
          { id: 't-q5-c', label: 'Warm to hot with splashing rain, overhead irrigation or wind-driven rain', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 3, 'tomato-septoria': 2 } },
          { id: 't-q5-d', label: 'Mild and moist, with soil splash onto lower leaves and dense foliage', weights: { 'tomato-early-blight': 2, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 1, 'tomato-septoria': 3 } }
        ]
      },
      {
        id: 't-q6',
        text: 'How is the damage progressing?',
        options: [
          { id: 't-q6-a', label: 'Spots grow larger with clear rings; lower leaves brown and drop steadily', weights: { 'tomato-early-blight': 3, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 1, 'tomato-septoria': 1 } },
          { id: 't-q6-b', label: 'Whole branches collapse quickly; lesions run down stems and plants die', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': 3, 'tomato-bacterial-spot': 1, 'tomato-septoria': -1 } },
          { id: 't-q6-c', label: 'Many small spots appear at once on leaves and fruit; leaves yellow and fall', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': 1, 'tomato-bacterial-spot': 3, 'tomato-septoria': 2 } },
          { id: 't-q6-d', label: 'Numerous tiny speckled spots on lower leaves; stems and fruit stay healthy', weights: { 'tomato-early-blight': 1, 'tomato-late-blight': -1, 'tomato-bacterial-spot': 1, 'tomato-septoria': 3 } }
        ]
      }
    ]
  },

  potato: {
    cropId: 'potato',
    cropName: 'Potato',
    diseaseIds: ['potato-late-blight', 'potato-early-blight', 'potato-bacterial-wilt', 'potato-black-scurf'],
    questions: [
      {
        id: 'p-q1',
        text: 'Where is the damage most obvious?',
        options: [
          { id: 'p-q1-a', label: 'Leaf tips and margins — large dark water-soaked patches spreading fast', weights: { 'potato-late-blight': 3, 'potato-early-blight': 1, 'potato-bacterial-wilt': -1, 'potato-black-scurf': 0 } },
          { id: 'p-q1-b', label: 'Older, lower leaves — small dark brown spots that stay limited at first', weights: { 'potato-late-blight': 1, 'potato-early-blight': 3, 'potato-bacterial-wilt': -1, 'potato-black-scurf': 0 } },
          { id: 'p-q1-c', label: 'The whole plant wilts in the heat of the day, starting with lower leaves', weights: { 'potato-late-blight': 1, 'potato-early-blight': -1, 'potato-bacterial-wilt': 3, 'potato-black-scurf': 0 } },
          { id: 'p-q1-d', label: 'Tuber surfaces — hard black crusty specks that will not wash off', weights: { 'potato-late-blight': 0, 'potato-early-blight': 0, 'potato-bacterial-wilt': 0, 'potato-black-scurf': 3 } }
        ]
      },
      {
        id: 'p-q2',
        text: 'Describe the leaf symptoms.',
        options: [
          { id: 'p-q2-a', label: 'Irregular dark green-black water-soaked blotches with a pale margin', weights: { 'potato-late-blight': 3, 'potato-early-blight': 1, 'potato-bacterial-wilt': -1, 'potato-black-scurf': -1 } },
          { id: 'p-q2-b', label: 'Dark brown spots with concentric target rings; tissue around them yellows', weights: { 'potato-late-blight': 1, 'potato-early-blight': 3, 'potato-bacterial-wilt': -1, 'potato-black-scurf': -1 } },
          { id: 'p-q2-c', label: 'No distinct lesions — leaves roll, yellow-green and wilt from the base', weights: { 'potato-late-blight': -1, 'potato-early-blight': -1, 'potato-bacterial-wilt': 3, 'potato-black-scurf': 1 } },
          { id: 'p-q2-d', label: 'No leaf spots; stems near the soil have dark sunken cankers and vines weaken', weights: { 'potato-late-blight': -1, 'potato-early-blight': -1, 'potato-bacterial-wilt': 1, 'potato-black-scurf': 3 } }
        ]
      },
      {
        id: 'p-q3',
        text: 'Is there downy or mouldy growth on the foliage?',
        options: [
          { id: 'p-q3-a', label: 'Yes — white to grey down on lesion undersides during cool, wet mornings', weights: { 'potato-late-blight': 3, 'potato-early-blight': -1, 'potato-bacterial-wilt': -1, 'potato-black-scurf': -1 } },
          { id: 'p-q3-b', label: 'No mould — dry-looking spots with clear concentric rings', weights: { 'potato-late-blight': -1, 'potato-early-blight': 3, 'potato-bacterial-wilt': -1, 'potato-black-scurf': 0 } },
          { id: 'p-q3-c', label: 'No mould on the leaves — plants simply wilt and collapse', weights: { 'potato-late-blight': -1, 'potato-early-blight': -1, 'potato-bacterial-wilt': 3, 'potato-black-scurf': 0 } },
          { id: 'p-q3-d', label: 'No mould — the visible damage is on stems and tubers only', weights: { 'potato-late-blight': -1, 'potato-early-blight': 0, 'potato-bacterial-wilt': -1, 'potato-black-scurf': 3 } }
        ]
      },
      {
        id: 'p-q4',
        text: 'What is happening to the tubers?',
        options: [
          { id: 'p-q4-a', label: 'Firm, reddish-brown dry rot spreading through the tuber; skin looks greasy', weights: { 'potato-late-blight': 3, 'potato-early-blight': -1, 'potato-bacterial-wilt': -1, 'potato-black-scurf': -1 } },
          { id: 'p-q4-b', label: 'Dark, sunken, leathery patches on the skin that stay shallow', weights: { 'potato-late-blight': -1, 'potato-early-blight': 3, 'potato-bacterial-wilt': -1, 'potato-black-scurf': -1 } },
          { id: 'p-q4-c', label: 'Tubers look normal outside but turn creamy and slimy when cut', weights: { 'potato-late-blight': -1, 'potato-early-blight': -1, 'potato-bacterial-wilt': 3, 'potato-black-scurf': -1 } },
          { id: 'p-q4-d', label: 'Hard black scabs or sclerotia stuck to the skin like ingrained dirt', weights: { 'potato-late-blight': -1, 'potato-early-blight': -1, 'potato-bacterial-wilt': -1, 'potato-black-scurf': 3 } }
        ]
      },
      {
        id: 'p-q5',
        text: 'What were the field conditions before symptoms appeared?',
        options: [
          { id: 'p-q5-a', label: 'Cool, wet, very humid weather (about 10–22 °C) with frequent rain or dew', weights: { 'potato-late-blight': 3, 'potato-early-blight': 1, 'potato-bacterial-wilt': 1, 'potato-black-scurf': 1 } },
          { id: 'p-q5-b', label: 'Warm and humid with alternating wet and dry periods; crop is maturing or stressed', weights: { 'potato-late-blight': 1, 'potato-early-blight': 3, 'potato-bacterial-wilt': 1, 'potato-black-scurf': 1 } },
          { id: 'p-q5-c', label: 'Hot, wet, poorly drained soil; the same field grew potatoes or tomatoes recently', weights: { 'potato-late-blight': 0, 'potato-early-blight': 1, 'potato-bacterial-wilt': 3, 'potato-black-scurf': 1 } },
          { id: 'p-q5-d', label: 'Heavy or waterlogged soil; seed came from a home-grown or saved lot', weights: { 'potato-late-blight': 1, 'potato-early-blight': 1, 'potato-bacterial-wilt': 2, 'potato-black-scurf': 3 } }
        ]
      },
      {
        id: 'p-q6',
        text: 'Is there anything unusual on the stems?',
        options: [
          { id: 'p-q6-a', label: 'Dark brown or black lesions on stems, sometimes with white mould; stems girdled', weights: { 'potato-late-blight': 3, 'potato-early-blight': 1, 'potato-bacterial-wilt': -1, 'potato-black-scurf': 0 } },
          { id: 'p-q6-b', label: 'Brown ringed lesions on stems and stolons that match the leaf spots', weights: { 'potato-late-blight': 1, 'potato-early-blight': 3, 'potato-bacterial-wilt': -1, 'potato-black-scurf': 1 } },
          { id: 'p-q6-c', label: 'Cutting the stem at the base shows a milky bacterial ooze', weights: { 'potato-late-blight': -1, 'potato-early-blight': -1, 'potato-bacterial-wilt': 3, 'potato-black-scurf': -1 } },
          { id: 'p-q6-d', label: 'Hard black crusty scales on stems at soil level; roots look reduced', weights: { 'potato-late-blight': -1, 'potato-early-blight': -1, 'potato-bacterial-wilt': 1, 'potato-black-scurf': 3 } }
        ]
      }
    ]
  }
};

/* ---------------------------------------------------------------------------
 * 3. PREDICTION / SCORING ENGINE
 * PROTOTYPE AI/ML DEMONSTRATION.
 * This is NOT a trained neural network or scikit-learn model running in the
 * browser, and it has no validated accuracy. It is a transparent, deterministic
 * scoring system that mirrors the shape of a classifier:
 *
 *   symptoms (answers) -> feature vector (weights) -> class scores -> ranking
 *                                                                 -> confidence
 *
 * To connect a real model later, replace the body of `predictDisease()` with a
 * call to a hosted Python/scikit-learn endpoint (same input shape: cropId +
 * answers; same output shape: prediction object below) and keep `renderResult()`
 * unchanged. See the comments on each step for the exact mapping.
 * --------------------------------------------------------------------------- */

/** Weakest wording used for the evidence list. */
const WEIGHT_LABELS = { 3: 'Strong match', 2: 'Moderate match', 1: 'Mild match' };

/** Human-readable confidence bands (text first — never colour alone). */
function confidenceBand(confidence) {
  if (confidence >= 75) return { label: 'Strong match', tone: 'strong' };
  if (confidence >= 55) return { label: 'Moderate match', tone: 'moderate' };
  if (confidence >= 40) return { label: 'Limited match', tone: 'limited' };
  return { label: 'Weak match — inconclusive', tone: 'weak' };
}

/**
 * Score every disease of the selected crop against the chosen answers.
 *
 * @param {string} cropId      'rice' | 'tomato' | 'potato'
 * @param {Object} answers     { [questionId]: optionId }
 * @returns {Object} prediction — the same shape a real model adapter would return:
 *   { cropId, cropName, answered, total, confidence, band,
 *     top: { diseaseId, name, crop, share, score },
 *     ranked: [{ diseaseId, name, score, share }],
 *     evidence: [{ label, question, weight }] }
 */
function predictDisease(cropId, answers) {
  const assessment = ASSESSMENTS[cropId];
  const diseaseIds = assessment.diseaseIds;
  const questions = assessment.questions;

  // --- Step A (model input): build the feature/score vector -----------------
  const rawScores = {};
  const matched = [];
  diseaseIds.forEach((id) => (rawScores[id] = 0));

  questions.forEach((question) => {
    const optionId = answers[question.id];
    if (!optionId) return; // unanswered questions contribute nothing
    const option = question.options.find((o) => o.id === optionId);
    if (!option) return;
    diseaseIds.forEach((id) => {
      rawScores[id] += option.weights[id] || 0;
    });
    matched.push({ question: question.text, label: option.label, weights: option.weights });
  });

  // --- Step B (model scoring): keep only supporting evidence ----------------
  const scores = {};
  diseaseIds.forEach((id) => (scores[id] = Math.max(0, rawScores[id])));
  const totalSupport = diseaseIds.reduce((sum, id) => sum + scores[id], 0) || 1;

  // The best score any disease could reach from the questions that were asked.
  const maxPossible = {};
  diseaseIds.forEach((id) => {
    maxPossible[id] = questions.reduce((sum, q) => {
      const best = Math.max(...q.options.map((o) => o.weights[id] || 0));
      return sum + Math.max(0, best);
    }, 0);
  });

  // --- Step C (ranking): order the candidate diseases ------------------------
  const ranked = diseaseIds
    .map((id) => ({
      diseaseId: id,
      name: DISEASES[id].name,
      crop: DISEASES[id].crop,
      score: scores[id],
      share: scores[id] / totalSupport
    }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];

  // --- Step D (confidence): blend relative + absolute evidence ---------------
  //   share     = how much of the total supporting score this disease owns
  //   strength  = how much of the available evidence for this disease we captured
  // The result is capped at 90% on purpose: a prototype must not look more
  // certain than it is.
  const strength = maxPossible[top.diseaseId] ? top.score / maxPossible[top.diseaseId] : 0;
  const confidence = Math.min(
    90,
    Math.max(5, Math.round(100 * (0.6 * top.share + 0.4 * strength)))
  );

  // --- Step E (explainability): which answers contributed? -------------------
  const evidence = matched
    .filter((m) => (m.weights[top.diseaseId] || 0) > 0)
    .map((m) => ({
      label: m.label,
      question: m.question,
      weight: m.weights[top.diseaseId]
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);

  return {
    cropId,
    cropName: assessment.cropName,
    answered: Object.keys(answers).length,
    total: questions.length,
    confidence,
    band: confidenceBand(confidence),
    top: { ...top, share: top.share },
    ranked,
    evidence
  };
}

/* ===========================================================================
 * 4. APP PAGE UI
 * Crop selection -> questions (progress, validation, back/next, restart)
 * -> results (confidence, evidence, disease information, save result)
 * ======================================================================== */

const STORAGE_KEY = 'cropalert.savedResults';
const appState = { cropId: null, index: 0, answers: {}, prediction: null };
let storageAvailable = true;

/** Small helper: `$` shorthand for document.getElementById. */
function $(id) { return document.getElementById(id); }

/** Toggle the three steps of the assessment flow. */
function showStep(step) {
  const crops = $('step-crops');
  const quiz = $('step-quiz');
  const result = $('step-result');
  if (!crops || !quiz || !result) return;
  crops.hidden = step !== 'crops';
  quiz.hidden = step !== 'quiz';
  result.hidden = step !== 'result';
}

/* ---- Crop selection ----------------------------------------------------- */
function startAssessment(cropId) {
  if (!ASSESSMENTS[cropId]) return;
  appState.cropId = cropId;
  appState.index = 0;
  appState.answers = {};
  appState.prediction = null;

  $('assessment-crop').textContent = ASSESSMENTS[cropId].cropName;
  const saveBtn = $('btn-save');
  if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save result'; }

  showStep('quiz');
  renderQuestion(true);
}

/* ---- Question rendering -------------------------------------------------- */
function renderQuestion(moveFocus) {
  const assessment = ASSESSMENTS[appState.cropId];
  const question = assessment.questions[appState.index];
  const total = assessment.questions.length;
  const position = appState.index + 1;

  // Progress indicator (text + visual bar, so progress never relies on colour).
  $('progress-text').textContent = `Question ${position} of ${total}`;
  const bar = $('progress-bar');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', String(total));
  bar.setAttribute('aria-valuenow', String(position));
  bar.setAttribute('aria-valuetext', `Question ${position} of ${total}`);
  $('progress-fill').style.width = `${Math.round((position / total) * 100)}%`;

  // Question text + answer options (radio group inside a labelled fieldset).
  $('question-text').textContent = question.text;
  const chosen = appState.answers[question.id];
  $('question-options').innerHTML = question.options
    .map(
      (option) => `
      <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-400 hover:bg-brand-50/60 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:ring-1 has-[:checked]:ring-brand-600 focus-within:ring-2 focus-within:ring-harvest-600 focus-within:ring-offset-2 focus-within:ring-offset-canvas">
        <input type="radio" class="mt-1 h-4 w-4 shrink-0 accent-brand-700" name="${question.id}" value="${option.id}" id="${option.id}" ${chosen === option.id ? 'checked' : ''}>
        <span class="text-[0.975rem] leading-relaxed text-ink-800">${option.label}</span>
      </label>`
    )
    .join('');

  // Keep answers in state as soon as a radio is chosen; also clears validation.
  $('question-options').querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      appState.answers[question.id] = input.value;
      clearQuestionError();
    });
  });

  // Buttons reflect position in the flow.
  $('btn-back').disabled = appState.index === 0;
  $('btn-next').textContent = position === total ? 'See my result' : 'Next question';
  clearQuestionError();

  if (moveFocus) {
    const first = $(chosen) || $('question-options').querySelector('input[type="radio"]');
    if (first) first.focus();
  }
}

/* ---- Validation ---------------------------------------------------------- */
function clearQuestionError() {
  const error = $('question-error');
  const fieldset = $('question-fieldset');
  if (error) error.hidden = true;
  if (fieldset) fieldset.removeAttribute('aria-invalid');
}
function showQuestionError() {
  const error = $('question-error');
  const fieldset = $('question-fieldset');
  if (error) {
    error.hidden = false;
    error.textContent = 'Please choose an answer before continuing. Use the arrow keys or Tab to move between options.';
  }
  if (fieldset) fieldset.setAttribute('aria-invalid', 'true');
  const first = $('question-options').querySelector('input[type="radio"]');
  if (first) first.focus();
}

/* ---- Navigation through the questions ------------------------------------ */
function goNext() {
  const question = ASSESSMENTS[appState.cropId].questions[appState.index];
  if (!appState.answers[question.id]) {
    showQuestionError();
    return;
  }
  const isLast = appState.index === ASSESSMENTS[appState.cropId].questions.length - 1;
  if (isLast) {
    submitAssessment();
  } else {
    appState.index += 1;
    renderQuestion(true);
  }
}

function goBack() {
  if (appState.index === 0) return;
  appState.index -= 1;
  renderQuestion(true);
}

function restartAssessment() {
  appState.cropId = null;
  appState.index = 0;
  appState.answers = {};
  appState.prediction = null;
  showStep('crops');
  const firstCrop = document.querySelector('[data-crop-choice]');
  if (firstCrop) firstCrop.focus();
}

/* ---- Result generation --------------------------------------------------- */
function submitAssessment() {
  // Run the scoring engine (swap point for a real ML model — see section 3).
  appState.prediction = predictDisease(appState.cropId, appState.answers);
  renderResult(appState.prediction);
  showStep('result');
  const heading = $('result-heading');
  if (heading) heading.focus();
}

function renderResult(prediction) {
  const disease = DISEASES[prediction.top.diseaseId];
  const confidence = prediction.confidence;

  // Headline result ---------------------------------------------------------
  $('result-crop').textContent = prediction.cropName;
  $('result-disease').textContent = disease.name;
  $('result-confidence').textContent = `${confidence}% match`;
  $('result-band').textContent = prediction.band.label;
  // The bar is decorative (aria-hidden); the number and band label above are
  // the accessible text equivalent of this value.
  $('confidence-fill').style.width = `${confidence}%`;

  // Honest, plain-language explanation --------------------------------------
  $('result-explanation').innerHTML =
    `Your answers most closely match <strong>${disease.name}</strong> in ${prediction.cropName}. ` +
    `The prototype matched ${prediction.answered} of ${prediction.total} answered symptoms against the four ` +
    `${prediction.cropName.toLowerCase()} diseases it covers, and rated the strongest candidate ` +
    `<strong>${confidence}%</strong> (${prediction.band.label.toLowerCase()}). ` +
    (confidence < 40
      ? 'This is a weak match, so the answers do not point clearly to one disease — please review the other candidates below or consult an agronomist.'
      : `Consider the other candidates listed below before making any management decision.`);

  // Evidence: the answers that contributed to the prediction -----------------
  $('evidence-list').innerHTML = prediction.evidence
    .map(
      (item) => `
      <li class="flex items-start gap-3">
        <span class="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-200">${WEIGHT_LABELS[item.weight] || 'Supporting'}</span>
        <span class="text-ink-800">${item.label}</span>
      </li>`
    )
    .join('');

  // Score distribution across the four candidate diseases --------------------
  $('candidate-list').innerHTML = prediction.ranked
    .map(
      (candidate, index) => `
      <li class="flex items-center gap-3">
        <span class="w-6 shrink-0 text-sm font-semibold ${index === 0 ? 'text-brand-800' : 'text-ink-600'}">${index === 1 ? '2nd' : index === 2 ? '3rd' : index === 3 ? '4th' : 'Top'}</span>
        <span class="w-44 shrink-0 truncate text-sm ${index === 0 ? 'font-semibold text-ink-900' : 'text-ink-700'}">${candidate.name}</span>
        <span class="h-3 flex-1 overflow-hidden rounded-full bg-brand-100" aria-hidden="true">
          <span class="block h-full rounded-full ${index === 0 ? 'bg-brand-600' : 'bg-brand-300'}" style="width:${Math.max(2, Math.round(candidate.share * 100))}%"></span>
        </span>
        <span class="w-12 shrink-0 text-right text-sm font-medium text-ink-700">${Math.round(candidate.share * 100)}%</span>
      </li>`
    )
    .join('');

  // Disease information card --------------------------------------------------
  $('disease-crop').textContent = disease.crop;
  $('disease-name').textContent = disease.name;
  $('disease-causal').textContent = disease.causal;
  $('disease-parts').textContent = disease.parts;
  $('disease-conditions').textContent = disease.conditions;
  $('disease-management').textContent = disease.management;
  $('disease-prevention').textContent = disease.prevention;
  $('disease-symptoms').innerHTML = disease.keySymptoms.map((s) => `<li>${s}</li>`).join('');
  $('result-library-link').href = `library.html#${disease.id}`;

  const saveBtn = $('btn-save');
  if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save result'; }
  const status = $('save-status');
  if (status) status.textContent = '';
}

/* ---- History / saved-result functionality --------------------------------
 * Saved results live in localStorage so they survive a refresh. Everything is
 * wrapped in try/catch because some browsers block storage for file:// pages.
 * ------------------------------------------------------------------------ */
function loadHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    storageAvailable = false;
    return [];
  }
}

function saveHistory(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    storageAvailable = true;
    return true;
  } catch (error) {
    storageAvailable = false;
    return false;
  }
}

function saveCurrentResult() {
  const prediction = appState.prediction;
  if (!prediction) return;
  const status = $('save-status');
  const items = loadHistory();
  items.unshift({
    savedAt: new Date().toISOString(),
    crop: prediction.cropName,
    diseaseId: prediction.top.diseaseId,
    disease: DISEASES[prediction.top.diseaseId].name,
    confidence: prediction.confidence,
    band: prediction.band.label
  });
  const ok = saveHistory(items.slice(0, 20)); // keep the last 20 results
  if (status) {
    status.textContent = ok
      ? 'Result saved on this device. It is listed under “Saved assessments” below.'
      : 'This browser is blocking local storage, so the result could not be saved. You can copy the details instead.';
  }
  const saveBtn = $('btn-save');
  if (saveBtn && ok) { saveBtn.disabled = true; saveBtn.textContent = 'Saved'; }
  renderHistory();
}

function renderHistory() {
  const list = $('history-list');
  if (!list) return;
  const empty = $('history-empty');
  const clearBtn = $('btn-clear-history');
  const note = $('history-note');
  const items = loadHistory();

  if (note) {
    note.hidden = storageAvailable;
    note.textContent =
      'Local storage is unavailable in this browser (common when opening files directly), so saved results will not persist.';
  }
  if (empty) empty.hidden = items.length > 0;
  if (clearBtn) clearBtn.hidden = items.length === 0;

  list.innerHTML = items
    .map((item) => {
      const date = new Date(item.savedAt);
      const dateLabel = Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      return `
      <li class="flex flex-col gap-1 rounded-xl border border-brand-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p class="font-semibold text-ink-900">${item.disease} <span class="font-normal text-ink-600">in ${item.crop}</span></p>
          <p class="text-sm text-ink-600">${item.confidence}% match · ${item.band}${dateLabel ? ' · ' + dateLabel : ''}</p>
        </div>
        <a class="text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-harvest-600 focus-visible:ring-offset-2 rounded"
           href="library.html#${item.diseaseId}">Open in library</a>
      </li>`;
    })
    .join('');
}

function clearHistory() {
  saveHistory([]);
  renderHistory();
  const status = $('save-status');
  if (status) status.textContent = 'Saved assessments cleared.';
}

function initAppPage() {
  if (!$('step-crops')) return; // not the app page

  // Crop selection buttons (three crops, each with four candidate diseases).
  document.querySelectorAll('[data-crop-choice]').forEach((button) => {
    button.addEventListener('click', () => startAssessment(button.dataset.cropChoice));
  });

  // Fill the disease lists inside the crop cards from the single data source.
  document.querySelectorAll('[data-disease-list]').forEach((list) => {
    const crop = CROPS.find((c) => c.id === list.dataset.diseaseList);
    if (crop) list.innerHTML = crop.diseaseIds.map((id) => `<li>${DISEASES[id].name}</li>`).join('');
  });

  // Question-flow buttons.
  $('btn-next')?.addEventListener('click', goNext);
  $('btn-back')?.addEventListener('click', goBack);
  $('btn-restart')?.addEventListener('click', restartAssessment);
  $('btn-assess-again')?.addEventListener('click', restartAssessment);
  $('btn-save')?.addEventListener('click', saveCurrentResult);
  $('btn-clear-history')?.addEventListener('click', clearHistory);

  // Deep link: app.html?crop=rice starts that crop's assessment straight away.
  try {
    const requested = new URLSearchParams(window.location.search).get('crop');
    if (requested && ASSESSMENTS[requested]) startAssessment(requested);
  } catch (error) { /* ignore: query strings can be unavailable on file:// */ }

  renderHistory();
}

/* ===========================================================================
 * 5. DISEASE LIBRARY UI
 * Builds the twelve disease cards once, then applies search and crop filters.
 * ======================================================================== */

function buildLibrary() {
  const container = $('library-groups');
  if (!container) return;

  container.innerHTML = CROPS.map((crop) => {
    const cards = crop.diseaseIds
      .map((id) => {
        const d = DISEASES[id];
        const haystack = [d.name, d.crop, d.causal, d.summary, d.symptoms, d.parts, d.conditions, d.management, d.prevention]
          .join(' ')
          .toLowerCase();
        return `
        <details id="${d.id}" data-crop="${d.cropId}" data-search="${haystack.replace(/"/g, '&quot;')}"
                 class="group rounded-2xl border border-brand-200 bg-white shadow-card">
          <summary class="flex cursor-pointer list-none items-start justify-between gap-4 p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-harvest-600 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-2xl">
            <div>
              <span class="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-800 ring-1 ring-brand-200">${d.crop}</span>
              <h3 class="mt-2 font-display text-lg font-semibold text-ink-900">${d.name}</h3>
              <p class="mt-1 text-sm text-ink-600">${d.causal}</p>
              <p class="mt-2 text-sm leading-relaxed text-ink-700">${d.summary}</p>
            </div>
            <span class="mt-1 inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1.5 text-sm font-semibold text-brand-800 ring-1 ring-brand-200">
              <span class="hidden sm:inline">Details</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 transition-transform duration-150 group-open:rotate-180"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>
            </span>
          </summary>
          <div class="border-t border-brand-100 px-5 pb-5 pt-4">
            <h4 class="font-display text-sm font-semibold uppercase tracking-wide text-brand-700">Main symptoms</h4>
            <p class="mt-1.5 text-[0.975rem] leading-relaxed text-ink-800">${d.symptoms}</p>
            <dl class="mt-4 grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-canvas p-4">
                <dt class="text-sm font-semibold text-ink-900">Affected plant parts</dt>
                <dd class="mt-1 text-sm leading-relaxed text-ink-700">${d.parts}</dd>
              </div>
              <div class="rounded-xl bg-canvas p-4">
                <dt class="text-sm font-semibold text-ink-900">Favourable conditions</dt>
                <dd class="mt-1 text-sm leading-relaxed text-ink-700">${d.conditions}</dd>
              </div>
              <div class="rounded-xl bg-canvas p-4">
                <dt class="text-sm font-semibold text-ink-900">Management</dt>
                <dd class="mt-1 text-sm leading-relaxed text-ink-700">${d.management}</dd>
              </div>
              <div class="rounded-xl bg-canvas p-4">
                <dt class="text-sm font-semibold text-ink-900">Prevention</dt>
                <dd class="mt-1 text-sm leading-relaxed text-ink-700">${d.prevention}</dd>
              </div>
            </dl>
            <p class="mt-4 text-sm text-ink-600">
              CropAlert assessment:
              <a class="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-harvest-600 focus-visible:ring-offset-2 rounded" href="app.html?crop=${d.cropId}">start a ${d.crop.toLowerCase()} assessment</a>.
            </p>
          </div>
        </details>`;
      })
      .join('');

    return `
      <section class="library-group" data-crop-group="${crop.id}" aria-labelledby="group-${crop.id}">
        <div class="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-brand-200 pb-2">
          <h2 id="group-${crop.id}" class="font-display text-xl font-semibold text-ink-900">${crop.name} <span class="text-base font-normal italic text-ink-600">${crop.scientific}</span></h2>
          <p class="text-sm text-ink-600">${crop.diseaseIds.length} diseases</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2" data-crop-cards>${cards}</div>
      </section>`;
  }).join('');
}

function filterLibrary() {
  const searchInput = $('library-search');
  const cropFilter = $('library-filter');
  const countEl = $('library-count');
  const emptyEl = $('library-empty');
  if (!searchInput) return;

  const term = searchInput.value.trim().toLowerCase();
  const crop = cropFilter ? cropFilter.value : 'all';
  let visible = 0;

  document.querySelectorAll('#library-groups details').forEach((card) => {
    const matchesSearch = !term || card.dataset.search.includes(term);
    const matchesCrop = crop === 'all' || card.dataset.crop === crop;
    card.hidden = !(matchesSearch && matchesCrop);
    if (!card.hidden) visible += 1;
  });

  // Hide a whole crop section when none of its cards match.
  document.querySelectorAll('.library-group').forEach((group) => {
    group.hidden = !group.querySelector('details:not([hidden])');
  });

  if (countEl) countEl.textContent = `Showing ${visible} of ${Object.keys(DISEASES).length} diseases`;
  if (emptyEl) emptyEl.hidden = visible !== 0;
}

function openLinkedDisease() {
  const id = window.location.hash.replace('#', '');
  if (!id || !DISEASES[id]) return;
  const card = document.getElementById(id);
  if (!card) return;
  card.open = true;
  card.scrollIntoView({ block: 'center' });
  card.querySelector('summary')?.focus();
}

function initLibraryPage() {
  if (!$('library-groups')) return;
  buildLibrary();
  filterLibrary();

  $('library-search')?.addEventListener('input', filterLibrary);
  $('library-filter')?.addEventListener('change', filterLibrary);
  $('btn-clear-search')?.addEventListener('click', () => {
    $('library-search').value = '';
    if ($('library-filter')) $('library-filter').value = 'all';
    filterLibrary();
    $('library-search').focus();
  });

  openLinkedDisease();
  window.addEventListener('hashchange', openLinkedDisease);
}

/* ===========================================================================
 * 6. SHARED UI — mobile navigation, footer year, disease lists on any page
 * ======================================================================== */

function initMobileNav() {
  const button = $('nav-toggle');
  const menu = $('mobile-menu');
  if (!button || !menu) return;
  const label = $('nav-toggle-label');

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('hidden', !open);
    if (label) label.textContent = open ? 'Close main menu' : 'Open main menu';
  };

  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
}

/** Fills any [data-disease-list] list on pages other than the app page too. */
function fillDiseaseLists() {
  document.querySelectorAll('[data-disease-list]').forEach((list) => {
    const crop = CROPS.find((c) => c.id === list.dataset.diseaseList);
    if (crop && !list.innerHTML) {
      list.innerHTML = crop.diseaseIds.map((id) => `<li>${DISEASES[id].name}</li>`).join('');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  fillDiseaseLists();
  initAppPage();
  initLibraryPage();
  const year = $('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
