"""
Configuration management for WeatherCrop AI Platform
"""

import os
import yaml
from pathlib import Path
from typing import Dict, Any, Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class APIKeys:
    """API Keys configuration"""
    bhuvan_api_key: str = ""
    openweather_api_key: str = ""
    weatherapi_key: str = ""
    agri_data_api_key: str = ""
    commodity_api_key: str = ""
    postgres_url: str = ""
    mongodb_url: str = ""

@dataclass
class ModelConfig:
    """Model configuration"""
    model_type: str
    params: Dict[str, Any]

@dataclass
class DataSourceConfig:
    """Data source configuration"""
    base_url: str
    data_format: str = "json"
    update_frequency: str = "daily"

@dataclass
class AppConfig:
    """Application configuration"""
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    log_level: str = "INFO"
    log_file: str = "logs/wchr.log"
    cache_ttl: int = 3600
    rate_limit: str = "100/hour"

class ConfigManager:
    """Configuration manager for the WeatherCrop AI Platform"""

    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize configuration manager

        Args:
            config_path: Path to configuration file
        """
        self.config_path = config_path or self._find_config_file()
        self.config = self._load_config()
        self._setup_logging()

    def _find_config_file(self) -> str:
        """Find configuration file in standard locations"""
        possible_paths = [
            "config/config.yaml",
            "config/config.yml",
            "../config/config.yaml",
            "../../config/config.yaml"
        ]

        for path in possible_paths:
            if os.path.exists(path):
                return path

        # If no config file found, create from example
        example_path = "config/config.example.yaml"
        config_path = "config/config.yaml"

        if os.path.exists(example_path):
            logger.warning(f"No config file found. Creating {config_path} from example.")
            os.makedirs(os.path.dirname(config_path), exist_ok=True)
            with open(example_path, 'r') as src, open(config_path, 'w') as dst:
                dst.write(src.read())
            return config_path

        raise FileNotFoundError("No configuration file found. Please create config/config.yaml")

    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from YAML file"""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as file:
                config = yaml.safe_load(file)

            # Override with environment variables if they exist
            config = self._override_with_env_vars(config)

            logger.info(f"Configuration loaded from {self.config_path}")
            return config

        except Exception as e:
            logger.error(f"Error loading configuration: {e}")
            raise

    def _override_with_env_vars(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Override configuration with environment variables"""
        env_mappings = {
            'BHUVAN_API_KEY': ['api_keys', 'bhuvan_api_key'],
            'OPENWEATHER_API_KEY': ['api_keys', 'openweather_api_key'],
            'POSTGRES_URL': ['api_keys', 'postgres_url'],
            'MONGODB_URL': ['api_keys', 'mongodb_url'],
            'APP_HOST': ['app', 'host'],
            'APP_PORT': ['app', 'port'],
            'DEBUG': ['app', 'debug'],
            'LOG_LEVEL': ['app', 'log_level']
        }

        for env_var, config_path in env_mappings.items():
            value = os.getenv(env_var)
            if value:
                # Navigate to the nested config location
                current = config
                for key in config_path[:-1]:
                    if key not in current:
                        current[key] = {}
                    current = current[key]

                # Convert value to appropriate type
                if config_path[-1] in ['port']:
                    value = int(value)
                elif config_path[-1] in ['debug']:
                    value = value.lower() in ('true', '1', 'yes', 'on')

                current[config_path[-1]] = value

        return config

    def _setup_logging(self):
        """Setup logging configuration"""
        log_config = self.get_app_config()

        # Create logs directory if it doesn't exist
        log_file = log_config.log_file
        os.makedirs(os.path.dirname(log_file), exist_ok=True)

        # Configure logging
        logging.basicConfig(
            level=getattr(logging, log_config.log_level.upper()),
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )

    def get_api_keys(self) -> APIKeys:
        """Get API keys configuration"""
        api_config = self.config.get('api_keys', {})
        return APIKeys(**api_config)

    def get_model_config(self, model_name: str) -> ModelConfig:
        """Get model configuration"""
        models_config = self.config.get('models', {})
        model_config = models_config.get(model_name, {})

        if not model_config:
            raise ValueError(f"Model configuration for '{model_name}' not found")

        return ModelConfig(
            model_type=model_config.get('model_type', ''),
            params=model_config
        )

    def get_data_source_config(self, source_name: str) -> DataSourceConfig:
        """Get data source configuration"""
        sources_config = self.config.get('data_sources', {})
        source_config = sources_config.get(source_name, {})

        if not source_config:
            raise ValueError(f"Data source configuration for '{source_name}' not found")

        return DataSourceConfig(**source_config)

    def get_app_config(self) -> AppConfig:
        """Get application configuration"""
        app_config = self.config.get('app', {})
        # Filter out unknown fields
        valid_fields = {
            'host', 'port', 'debug', 'log_level', 'log_file', 'cache_ttl', 'rate_limit'
        }
        filtered_config = {k: v for k, v in app_config.items() if k in valid_fields}
        return AppConfig(**filtered_config)

    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value by key (supports dot notation)"""
        keys = key.split('.')
        value = self.config

        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default

        return value

    def set(self, key: str, value: Any):
        """Set configuration value by key (supports dot notation)"""
        keys = key.split('.')
        config = self.config

        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]

        config[keys[-1]] = value

    def save_config(self, path: Optional[str] = None):
        """Save current configuration to file"""
        save_path = path or self.config_path

        with open(save_path, 'w', encoding='utf-8') as file:
            yaml.dump(self.config, file, default_flow_style=False, indent=2)

        logger.info(f"Configuration saved to {save_path}")

# Global configuration instance
config_manager = None

def get_config() -> ConfigManager:
    """Get global configuration manager instance"""
    global config_manager
    if config_manager is None:
        config_manager = ConfigManager()
    return config_manager

def reload_config():
    """Reload configuration"""
    global config_manager
    config_manager = ConfigManager()
    return config_manager
