from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAgent(ABC):
    """Abstract Base Class for all AI Agents in the framework."""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the agent's core reasoning logic asynchronously.
        :param context: Dict containing input data, caption, media info, platforms, and other agents' outputs.
        :return: Dict containing the agent's structured results.
        """
        pass
