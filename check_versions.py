import google.generativeai as genai
import langchain_google_genai
import pkg_resources

print(f"google-generativeai version: {pkg_resources.get_distribution('google-generativeai').version}")
print(f"langchain-google-genai version: {pkg_resources.get_distribution('langchain-google-genai').version}")

try:
    print(f"MediaResolution: {genai.GenerationConfig.MediaResolution}")
except AttributeError:
    print("genai.GenerationConfig has no attribute MediaResolution")
