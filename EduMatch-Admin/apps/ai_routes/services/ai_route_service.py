from apps.learning.models import Topic

from apps.ai_routes.models import (
    LearningRouteTopic
)


class AIRouteService:

    @staticmethod
    def generate_route_topics(
        learning_route,
        subject
    ):

        topics = Topic.objects.filter(
            module__subject=subject
        ).order_by(
            'order'
        )

        route_topics = []

        order_counter = 1

        for topic in topics:

            route_topic = LearningRouteTopic.objects.create(
                learning_route=learning_route,
                topic=topic,
                order=order_counter
            )

            route_topics.append(route_topic)

            order_counter += 1

        return route_topics