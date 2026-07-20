from __future__ import annotations

from typing import TYPE_CHECKING, Protocol

import plotly.graph_objects as go

from .constants import WEIGHT_UNIT

if TYPE_CHECKING:
    from collections.abc import Sequence


class _Entry(Protocol):
    date: str
    weight: float


BACKGROUND_COLOR = '#111111'
DEFAULT_CONFIG = {'displaylogo': False}
POST_SCRIPT = f'''document.body.style.backgroundColor = "{BACKGROUND_COLOR}"; document.title = "Weight Tracker";'''
TEMPLATE = 'plotly_dark'


def plot_data(data: Sequence[_Entry], average: float) -> None:
    fig = go.Figure()

    fig.update_layout(
        title={'text': '<b>Weight Tracker - data visualization</b>', 'x': 0.5, 'xanchor': 'center', 'font_size': 24},
        legend={'orientation': 'h', 'yanchor': 'bottom', 'y': 1.02, 'xanchor': 'right', 'x': 1},
        hovermode='x unified',
        xaxis_title='Date',
        yaxis_title=f'Weight [{WEIGHT_UNIT}]',
        template=TEMPLATE,
        paper_bgcolor=BACKGROUND_COLOR,
    )

    weights = [entry.weight for entry in data]
    dates = [entry.date for entry in data]
    length = len(dates)

    fig.add_trace(go.Scatter(x=dates, y=weights, name='Weight', line_color='cyan'))
    fig.add_trace(go.Scatter(x=dates, y=[average] * length, name='Avg', line_color='deeppink'))

    fig.show(config=DEFAULT_CONFIG, post_script=[POST_SCRIPT])
