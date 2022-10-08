from parrot import Parrot
import torch
import warnings
import pp_utils
warnings.filterwarnings("ignore")

'''
uncomment to get reproducable paraphrase generations
def random_state(seed):
  torch.manual_seed(seed)
  if torch.cuda.is_available():
    torch.cuda.manual_seed_all(seed)

random_state(1234)
'''

# Init models (make sure you init ONLY once if you integrate this to your code)
parrot = Parrot(model_tag="prithivida/parrot_paraphraser_on_T5", use_gpu=False)

headlines = pp_utils.get_headlines(20, 10)

# headlines = ["Can you recommed some upscale restaurants in Newyork?",
#            "What are the famous places we should not miss in Russia?"
# ]

for i, headl in enumerate(headlines):
    print("\n"+"-"*100)
    print("Headline ({i}): {h}".format(i=str(i+1), h=headl))
    print("-"*100, end="\n\n")
    para_phrases = parrot.augment(input_phrase=headl)
    if para_phrases:
        for para_phrase in para_phrases:
            print(para_phrase)
