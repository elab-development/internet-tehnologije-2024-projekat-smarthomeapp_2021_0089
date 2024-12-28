"""Add devices and locations table

Revision ID: 267e42d5e6dd
Revises: 6d0ef2baf23b
Create Date: 2024-12-08 15:32:04.835641

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '267e42d5e6dd'
down_revision: Union[str, None] = '6d0ef2baf23b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('locations',
    sa.Column('location_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.PrimaryKeyConstraint('location_id')
    )
    op.create_index(op.f('ix_locations_location_id'), 'locations', ['location_id'], unique=False)
    op.create_table('devices',
    sa.Column('device_id', sa.Integer(), nullable=False),
    sa.Column('location_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.Integer(), nullable=True),
    sa.Column('temperature', sa.Float(), nullable=True),
    sa.Column('device_type', sa.String(length=80), nullable=True),
    sa.Column('brightness', sa.Float(), nullable=True),
    sa.Column('color', sa.String(length=80), nullable=True),
    sa.ForeignKeyConstraint(['location_id'], ['locations.location_id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('device_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('devices')
    op.drop_index(op.f('ix_locations_location_id'), table_name='locations')
    op.drop_table('locations')
    # ### end Alembic commands ###