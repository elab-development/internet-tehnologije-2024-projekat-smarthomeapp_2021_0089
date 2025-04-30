"""Updated status column type in table devices to String

Revision ID: d985bdb9d674
Revises: 267e42d5e6dd
Create Date: 2024-12-08 15:39:48.044864

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd985bdb9d674'
down_revision: Union[str, None] = '267e42d5e6dd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'devices', 
        'status', 
        existing_type=sa.Integer(), 
        type_=sa.String(80)
    )


def downgrade() -> None:
    op.alter_column(
        'devices', 
        'status', 
        existing_type=sa.String(80), 
        type_=sa.Integer()
    )
