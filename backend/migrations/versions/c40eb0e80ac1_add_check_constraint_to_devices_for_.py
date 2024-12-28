"""Add check constraint to devices for temperature

Revision ID: c40eb0e80ac1
Revises: e7cfe6a498a2
Create Date: 2024-12-08 16:06:43.883740

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c40eb0e80ac1'
down_revision: Union[str, None] = 'e7cfe6a498a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_check_constraint(
        "check_temperature_positive",  # Ime ograničenja
        "devices",                     # Ime tabele
        "temperature >= 0"             # Pravilo za ograničenje
    )


def downgrade() -> None:
    op.drop_constraint(
        "check_temperature_positive",  # Ime ograničenja
        "devices",                     # Ime tabele
        type_="check"                  # Tip ograničenja
    )
