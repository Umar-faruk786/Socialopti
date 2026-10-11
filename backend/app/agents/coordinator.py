import asyncio
from typing import Dict, Any
from app.agents.trend_agent import TrendAnalysisAgent
from app.agents.content_agent import ContentAnalysisAgent
from app.agents.planning_agent import ContentPlanningAgent
from app.agents.prediction_agent import EngagementPredictionAgent
from app.agents.recommendation_agent import RecommendationAgent
from app.agents.analytics_agent import AnalyticsAgent

class MultiAgentCoordinator:
    """
    Central Coordinator for the Multi-Agent AI Framework.
    Orchestrates the collaborative workflow across all 6 specialized agents.
    """

    def __init__(self):
        self.trend_agent = TrendAnalysisAgent()
        self.content_agent = ContentAnalysisAgent()
        self.planning_agent = ContentPlanningAgent()
        self.prediction_agent = EngagementPredictionAgent()
        self.recommendation_agent = RecommendationAgent()
        self.analytics_agent = AnalyticsAgent()

    async def run_full_pipeline(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs the full multi-agent pipeline on newly uploaded or existing content.
        """
        # Step 1: Concurrently execute Trend and Content Analysis agents
        trend_task = self.trend_agent.process(content_data)
        content_task = self.content_agent.process(content_data)
        trend_result, content_result = await asyncio.gather(trend_task, content_task)

        # Step 2: Feed context into Content Planning Agent
        planning_context = {
            **content_data,
            "trend_data": trend_result,
            "content_analysis": content_result
        }
        planning_result = await self.planning_agent.process(planning_context)

        # Step 3: Concurrently execute Prediction and Recommendation agents
        prediction_context = {
            **content_data,
            "content_analysis": content_result,
            "trend_data": trend_result
        }
        recommendation_context = {
            **content_data,
            "content_analysis": content_result,
            "planning_data": planning_result,
            "trend_data": trend_result
        }

        prediction_task = self.prediction_agent.process(prediction_context)
        recommendation_task = self.recommendation_agent.process(recommendation_context)
        prediction_result, recommendation_result = await asyncio.gather(prediction_task, recommendation_task)

        return {
            "analysis": content_result,
            "trends": trend_result,
            "planning": planning_result,
            "recommendations": recommendation_result,
            "prediction": prediction_result
        }

# Global Singleton Instance
agent_coordinator = MultiAgentCoordinator()
