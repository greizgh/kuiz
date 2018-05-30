"""Kuiz backend component."""
from autobahn.asyncio.component import Component
import uuid
import random
from names import TEAMS

_wampSession = None
_clients = {}
_names = []

component = Component(
    transports=u"ws://localhost:8088/ws",
    realm=u"kuiz",
)


@component.register(u'kuiz.registerClient')
def _registerClient():
    id = str(uuid.uuid4())
    name = random.choice(TEAMS)
    while name in _names:
        name = random.choice(TEAMS)
    _names.append(name)
    client = {
        'id': id,
        'score': 0,
        'name': name
    }
    _clients[id] = client
    print("Registered client {} with name {}".format(id, client['name']))
    if _wampSession:
        _wampSession.publish('kuiz.newClient', client)
    return client


@component.subscribe(u'kuiz.setScore')
def _setScore(clientId, score):
    _clients[clientId]['score'] = score


@component.register(u'kuiz.getClients')
def _getClients():
    return [client for client in _clients.values()]


@component.on_join
def _joined(session, details):
    global _wampSession
    _wampSession = session
    print("Backend ready")
