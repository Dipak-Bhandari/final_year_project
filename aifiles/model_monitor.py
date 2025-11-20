import time
import logging
import json
from datetime import datetime
from typing import Dict, Any, Optional
# import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelMonitor:
    def __init__(self):
        self.metrics = {
            "response_times": [],
            "error_counts": {},
            "model_usage": {},
            "quality_scores": []
        }
        self.db_conn_str = os.getenv("PG_CONN_STR", "postgresql://postgres:admin@localhost:5432/bca_notes_ai")
    
    def start_timer(self) -> float:
        """Start timing an operation"""
        return time.time()
    
    def end_timer(self, start_time: float) -> float:
        """End timing and return duration"""
        return time.time() - start_time
    
    def log_response_time(self, model: str, operation: str, duration: float):
        """Log response time for monitoring"""
        metric = {
            "timestamp": datetime.now().isoformat(),
            "model": model,
            "operation": operation,
            "duration": duration
        }
        self.metrics["response_times"].append(metric)
        
        # Store in database
        self._store_metric("response_times", metric)
        
        # Log if response time is too high
        if duration > 10.0:  # 10 seconds threshold
            logger.warning(f"Slow response detected: {duration:.2f}s for {operation} with {model}")
    
    def log_error(self, model: str, error_type: str, error_message: str):
        """Log errors for monitoring"""
        if error_type not in self.metrics["error_counts"]:
            self.metrics["error_counts"][error_type] = 0
        self.metrics["error_counts"][error_type] += 1
        
        error_metric = {
            "timestamp": datetime.now().isoformat(),
            "model": model,
            "error_type": error_type,
            "error_message": error_message
        }
        
        self._store_metric("errors", error_metric)
        logger.error(f"Model error: {error_type} - {error_message}")
    
    def log_model_usage(self, model: str, operation: str):
        """Track model usage patterns"""
        if model not in self.metrics["model_usage"]:
            self.metrics["model_usage"][model] = {}
        if operation not in self.metrics["model_usage"][model]:
            self.metrics["model_usage"][model][operation] = 0
        
        self.metrics["model_usage"][model][operation] += 1
        
        usage_metric = {
            "timestamp": datetime.now().isoformat(),
            "model": model,
            "operation": operation
        }
        
        self._store_metric("model_usage", usage_metric)
    
    def log_quality_score(self, model: str, score: float, feedback: Optional[str] = None):
        """Log quality assessment scores"""
        quality_metric = {
            "timestamp": datetime.now().isoformat(),
            "model": model,
            "score": score,
            "feedback": feedback
        }
        
        self.metrics["quality_scores"].append(quality_metric)
        self._store_metric("quality_scores", quality_metric)
    
    def _store_metric(self, metric_type: str, data: Dict[str, Any]):
        """Store metrics in database"""
        try:
            conn = psycopg2.connect(self.db_conn_str)
            cur = conn.cursor()
            
            # Create metrics table if it doesn't exist
            cur.execute("""
                CREATE TABLE IF NOT EXISTS model_metrics (
                    id SERIAL PRIMARY KEY,
                    metric_type VARCHAR(50),
                    data JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cur.execute(
                "INSERT INTO model_metrics (metric_type, data) VALUES (%s, %s)",
                (metric_type, json.dumps(data))
            )
            
            conn.commit()
            cur.close()
            conn.close()
            
        except Exception as e:
            logger.error(f"Failed to store metric: {e}")
    
    def get_performance_stats(self, hours: int = 24) -> Dict[str, Any]:
        """Get performance statistics for the last N hours"""
        try:
            conn = psycopg2.connect(self.db_conn_str)
            cur = conn.cursor()
            
            # Get response time stats
            cur.execute("""
                SELECT 
                    AVG((data->>'duration')::float) as avg_duration,
                    MAX((data->>'duration')::float) as max_duration,
                    MIN((data->>'duration')::float) as min_duration,
                    COUNT(*) as total_requests
                FROM model_metrics 
                WHERE metric_type = 'response_times' 
                AND created_at >= NOW() - INTERVAL '%s hours'
            """, (hours,))
            
            response_stats = cur.fetchone()
            
            # Get error stats
            cur.execute("""
                SELECT 
                    data->>'error_type' as error_type,
                    COUNT(*) as count
                FROM model_metrics 
                WHERE metric_type = 'errors' 
                AND created_at >= NOW() - INTERVAL '%s hours'
                GROUP BY data->>'error_type'
            """, (hours,))
            
            error_stats = cur.fetchall()
            
            # Get model usage stats
            cur.execute("""
                SELECT 
                    data->>'model' as model,
                    data->>'operation' as operation,
                    COUNT(*) as count
                FROM model_metrics 
                WHERE metric_type = 'model_usage' 
                AND created_at >= NOW() - INTERVAL '%s hours'
                GROUP BY data->>'model', data->>'operation'
            """, (hours,))
            
            usage_stats = cur.fetchall()
            
            cur.close()
            conn.close()
            
            return {
                "response_times": {
                    "avg_duration": response_stats[0] if response_stats[0] else 0,
                    "max_duration": response_stats[1] if response_stats[1] else 0,
                    "min_duration": response_stats[2] if response_stats[2] else 0,
                    "total_requests": response_stats[3] if response_stats[3] else 0
                },
                "errors": dict(error_stats),
                "usage": usage_stats
            }
            
        except Exception as e:
            logger.error(f"Failed to get performance stats: {e}")
            return {}
    
    def health_check(self) -> Dict[str, Any]:
        """Perform health check on the model system"""
        try:
            # Check database connection
            conn = psycopg2.connect(self.db_conn_str)
            cur = conn.cursor()
            cur.execute("SELECT 1")
            cur.fetchone()
            cur.close()
            conn.close()
            db_status = "healthy"
        except Exception as e:
            db_status = f"unhealthy: {str(e)}"
        
        # Get recent performance stats
        recent_stats = self.get_performance_stats(hours=1)
        
        # Calculate health score
        health_score = 100
        
        # Deduct points for errors
        if recent_stats.get("errors"):
            error_count = sum(recent_stats["errors"].values())
            health_score -= min(error_count * 10, 50)  # Max 50 points deduction for errors
        
        # Deduct points for slow responses
        avg_duration = recent_stats.get("response_times", {}).get("avg_duration", 0)
        if avg_duration > 5.0:  # More than 5 seconds average
            health_score -= min((avg_duration - 5.0) * 10, 30)  # Max 30 points deduction
        
        return {
            "status": "healthy" if health_score > 70 else "degraded" if health_score > 40 else "unhealthy",
            "health_score": max(0, health_score),
            "database": db_status,
            "recent_stats": recent_stats,
            "timestamp": datetime.now().isoformat()
        }

# Global monitor instance
model_monitor = ModelMonitor()