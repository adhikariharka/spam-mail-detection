import unittest
from src.utils.email_utils import clean_text

class TestEmailUtils(unittest.TestCase):
    def test_clean_text_basic(self):
        self.assertEqual(clean_text("Hello World"), "Hello World")

    def test_clean_text_numbers(self):
        # Should replace long numbers with 'num'
        self.assertIn(" num ", clean_text("Price is 10000"))

    def test_clean_text_currency(self):
        # Should replace symbols
        self.assertIn("dollar", clean_text("Price is $50"))

if __name__ == '__main__':
    unittest.main()
