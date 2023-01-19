from django.db import models

# Create your models here.
class Interaction(models.Model):
    Interaction_ID = models.CharField(max_length=20,primary_key=True)
    Protein_ID_A = models.CharField(max_length=20)
    Protein_ID_B = models.CharField(max_length=20)


class Organism(models.Model):
    RID = models.CharField(max_length=20,primary_key=True)
    Protein_Name = models.CharField(max_length=20)
    Organism_Name = models.CharField(max_length=50)
    Protein_ID = models.CharField(max_length=20)


class Test(models.Model):
    Interaction_ID = models.CharField(max_length=20,primary_key=True)