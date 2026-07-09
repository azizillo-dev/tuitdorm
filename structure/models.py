from django.db import models


class Building(models.Model):
    """Placeholder Building model for scope relationships."""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Block(models.Model):
    """Placeholder Block model for scope relationships."""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Floor(models.Model):
    """Placeholder Floor model for scope relationships."""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
