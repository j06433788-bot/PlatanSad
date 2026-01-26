"""
Media Library API Tests for PlatanSad CMS
Tests: GET /api/media/files, GET /api/media/stats, POST /api/media/upload, 
       PUT /api/media/files/{id}, DELETE /api/media/files/{id}
"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestMediaLibraryAPI:
    """Media Library API endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures - get auth token"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get token
        login_response = self.session.post(
            f"{BASE_URL}/api/admin/login",
            json={"username": "admin", "password": "admin123"}
        )
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        
        token_data = login_response.json()
        self.token = token_data.get("access_token")
        self.auth_headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        # Track created files for cleanup
        self.created_file_ids = []
        
        yield
        
        # Cleanup: Delete test files
        for file_id in self.created_file_ids:
            try:
                self.session.delete(
                    f"{BASE_URL}/api/media/files/{file_id}",
                    headers=self.auth_headers
                )
            except:
                pass
    
    # ============ GET /api/media/stats Tests ============
    
    def test_get_media_stats_public(self):
        """Test GET /api/media/stats - public endpoint"""
        response = self.session.get(f"{BASE_URL}/api/media/stats")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "total_files" in data
        assert "total_size" in data
        assert "total_size_formatted" in data
        assert "by_type" in data
        assert "images" in data["by_type"]
        assert "videos" in data["by_type"]
        assert "documents" in data["by_type"]
        
        print(f"✓ Media stats: {data['total_files']} files, {data['total_size_formatted']}")
    
    # ============ GET /api/media/files Tests ============
    
    def test_get_media_files_public(self):
        """Test GET /api/media/files - public endpoint"""
        response = self.session.get(f"{BASE_URL}/api/media/files")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list)
        
        print(f"✓ Media files list: {len(data)} files")
    
    def test_get_media_files_with_filter(self):
        """Test GET /api/media/files with file_type filter"""
        response = self.session.get(f"{BASE_URL}/api/media/files?file_type=image")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list)
        
        # All returned files should be images
        for file in data:
            assert file.get("file_type") == "image", f"Expected image type, got {file.get('file_type')}"
        
        print(f"✓ Filtered media files (images): {len(data)} files")
    
    def test_get_media_files_with_pagination(self):
        """Test GET /api/media/files with limit and offset"""
        response = self.session.get(f"{BASE_URL}/api/media/files?limit=5&offset=0")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 5
        
        print(f"✓ Paginated media files: {len(data)} files (limit=5)")
    
    # ============ POST /api/media/upload Tests ============
    
    def test_upload_image_file(self):
        """Test POST /api/media/upload - upload image file"""
        # Create a simple test image (1x1 pixel PNG)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        # Use requests without session to avoid Content-Type header issues
        response = requests.post(
            f"{BASE_URL}/api/media/upload",
            files={'file': ('TEST_test_image.png', png_data, 'image/png')},
            data={
                'folder': 'test',
                'title': 'TEST_Test Image',
                'alt_text': 'Test image for API testing'
            },
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        result = response.json()
        assert result.get("success") == True
        assert "id" in result
        assert "url" in result
        assert result.get("file_type") == "image"
        
        # Track for cleanup
        self.created_file_ids.append(result["id"])
        
        print(f"✓ Uploaded image file: {result['id']}")
        return result["id"]
    
    def test_upload_without_auth_fails(self):
        """Test POST /api/media/upload without auth - should fail"""
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        response = requests.post(
            f"{BASE_URL}/api/media/upload",
            files={'file': ('test.png', png_data, 'image/png')}
            # No auth headers
        )
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        
        print("✓ Upload without auth correctly rejected")
    
    def test_upload_invalid_file_type(self):
        """Test POST /api/media/upload with invalid file type"""
        # Create a fake executable file
        exe_data = b'MZ\x90\x00\x03\x00\x00\x00'
        
        response = requests.post(
            f"{BASE_URL}/api/media/upload",
            files={'file': ('test.exe', exe_data, 'application/x-msdownload')},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        
        print("✓ Invalid file type correctly rejected")
    
    # ============ GET /api/media/files/{id} Tests ============
    
    def test_get_single_file(self):
        """Test GET /api/media/files/{id} - get single file"""
        # First upload a file
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        upload_response = requests.post(
            f"{BASE_URL}/api/media/upload",
            files={'file': ('TEST_single_file.png', png_data, 'image/png')},
            data={'title': 'TEST_Single File Test'},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        assert upload_response.status_code == 200, f"Upload failed: {upload_response.text}"
        file_id = upload_response.json()["id"]
        self.created_file_ids.append(file_id)
        
        # Now get the file
        response = self.session.get(f"{BASE_URL}/api/media/files/{file_id}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["id"] == file_id
        assert "filename" in data
        assert "url" in data
        assert "file_type" in data
        
        print(f"✓ Got single file: {data['original_name']}")
    
    def test_get_nonexistent_file(self):
        """Test GET /api/media/files/{id} with non-existent ID"""
        response = self.session.get(f"{BASE_URL}/api/media/files/nonexistent-id-12345")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print("✓ Non-existent file correctly returns 404")
    
    # ============ PUT /api/media/files/{id} Tests ============
    
    def test_update_file_metadata(self):
        """Test PUT /api/media/files/{id} - update file metadata"""
        # First upload a file
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        upload_response = requests.post(
            f"{BASE_URL}/api/media/upload",
            files={'file': ('TEST_update_test.png', png_data, 'image/png')},
            data={'title': 'TEST_Original Title', 'alt_text': 'Original alt text'},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        assert upload_response.status_code == 200, f"Upload failed: {upload_response.text}"
        file_id = upload_response.json()["id"]
        self.created_file_ids.append(file_id)
        
        # Update the file metadata
        update_data = {
            "title": "TEST_Updated Title",
            "alt_text": "Updated alt text for SEO"
        }
        
        response = self.session.put(
            f"{BASE_URL}/api/media/files/{file_id}",
            json=update_data,
            headers=self.auth_headers
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        result = response.json()
        assert result.get("success") == True
        
        # Verify update by getting the file
        get_response = self.session.get(f"{BASE_URL}/api/media/files/{file_id}")
        assert get_response.status_code == 200
        
        updated_file = get_response.json()
        assert updated_file["title"] == "TEST_Updated Title"
        assert updated_file["alt_text"] == "Updated alt text for SEO"
        
        print(f"✓ Updated file metadata: {file_id}")
    
    def test_update_without_auth_fails(self):
        """Test PUT /api/media/files/{id} without auth - should fail"""
        response = self.session.put(
            f"{BASE_URL}/api/media/files/some-id",
            json={"title": "New Title"}
            # No auth headers
        )
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        
        print("✓ Update without auth correctly rejected")
    
    # ============ DELETE /api/media/files/{id} Tests ============
    
    def test_delete_file(self):
        """Test DELETE /api/media/files/{id} - delete file"""
        # First upload a file
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        upload_response = requests.post(
            f"{BASE_URL}/api/media/upload",
            files={'file': ('TEST_delete_test.png', png_data, 'image/png')},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        assert upload_response.status_code == 200, f"Upload failed: {upload_response.text}"
        file_id = upload_response.json()["id"]
        
        # Delete the file
        response = self.session.delete(
            f"{BASE_URL}/api/media/files/{file_id}",
            headers=self.auth_headers
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        result = response.json()
        assert result.get("success") == True
        
        # Verify deletion by trying to get the file
        get_response = self.session.get(f"{BASE_URL}/api/media/files/{file_id}")
        assert get_response.status_code == 404, "File should not exist after deletion"
        
        print(f"✓ Deleted file: {file_id}")
    
    def test_delete_without_auth_fails(self):
        """Test DELETE /api/media/files/{id} without auth - should fail"""
        response = self.session.delete(
            f"{BASE_URL}/api/media/files/some-id"
            # No auth headers
        )
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        
        print("✓ Delete without auth correctly rejected")
    
    def test_delete_nonexistent_file(self):
        """Test DELETE /api/media/files/{id} with non-existent ID"""
        response = self.session.delete(
            f"{BASE_URL}/api/media/files/nonexistent-id-12345",
            headers=self.auth_headers
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print("✓ Delete non-existent file correctly returns 404")
    
    # ============ Full CRUD Flow Test ============
    
    def test_full_crud_flow(self):
        """Test complete CRUD flow: Create -> Read -> Update -> Delete"""
        print("\n--- Full CRUD Flow Test ---")
        
        # 1. CREATE - Upload file
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        create_response = requests.post(
            f"{BASE_URL}/api/media/upload",
            files={'file': ('TEST_crud_flow.png', png_data, 'image/png')},
            data={'title': 'TEST_CRUD Flow Test', 'alt_text': 'Initial alt text', 'folder': 'test'},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        assert create_response.status_code == 200, f"CREATE failed: {create_response.text}"
        file_id = create_response.json()["id"]
        print(f"  1. CREATE: Uploaded file {file_id}")
        
        # 2. READ - Get file
        read_response = self.session.get(f"{BASE_URL}/api/media/files/{file_id}")
        assert read_response.status_code == 200, f"READ failed: {read_response.text}"
        
        file_data = read_response.json()
        assert file_data["id"] == file_id
        assert file_data["title"] == "TEST_CRUD Flow Test"
        print(f"  2. READ: Got file {file_data['original_name']}")
        
        # 3. UPDATE - Update metadata
        update_response = self.session.put(
            f"{BASE_URL}/api/media/files/{file_id}",
            json={
                "title": "TEST_Updated CRUD Title",
                "alt_text": "Updated alt text"
            },
            headers=self.auth_headers
        )
        assert update_response.status_code == 200, f"UPDATE failed: {update_response.text}"
        
        # Verify update
        verify_response = self.session.get(f"{BASE_URL}/api/media/files/{file_id}")
        assert verify_response.json()["title"] == "TEST_Updated CRUD Title"
        print(f"  3. UPDATE: Updated file metadata")
        
        # 4. DELETE - Delete file
        delete_response = self.session.delete(
            f"{BASE_URL}/api/media/files/{file_id}",
            headers=self.auth_headers
        )
        assert delete_response.status_code == 200, f"DELETE failed: {delete_response.text}"
        
        # Verify deletion
        verify_delete = self.session.get(f"{BASE_URL}/api/media/files/{file_id}")
        assert verify_delete.status_code == 404, "File should be deleted"
        print(f"  4. DELETE: File deleted successfully")
        
        print("--- Full CRUD Flow Test PASSED ---\n")


class TestMediaStatsIntegration:
    """Test media stats update after operations"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.session = requests.Session()
        
        # Login
        login_response = self.session.post(
            f"{BASE_URL}/api/admin/login",
            json={"username": "admin", "password": "admin123"}
        )
        assert login_response.status_code == 200
        
        self.token = login_response.json().get("access_token")
        self.auth_headers = {"Authorization": f"Bearer {self.token}"}
        self.created_file_ids = []
        
        yield
        
        # Cleanup
        for file_id in self.created_file_ids:
            try:
                self.session.delete(
                    f"{BASE_URL}/api/media/files/{file_id}",
                    headers=self.auth_headers
                )
            except:
                pass
    
    def test_stats_update_after_upload(self):
        """Test that stats update after file upload"""
        # Get initial stats
        initial_stats = self.session.get(f"{BASE_URL}/api/media/stats").json()
        initial_count = initial_stats["total_files"]
        initial_images = initial_stats["by_type"]["images"]
        
        # Upload a file
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        upload_response = requests.post(
            f"{BASE_URL}/api/media/upload",
            files={'file': ('TEST_stats_test.png', png_data, 'image/png')},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        assert upload_response.status_code == 200, f"Upload failed: {upload_response.text}"
        file_id = upload_response.json()["id"]
        self.created_file_ids.append(file_id)
        
        # Get updated stats
        updated_stats = self.session.get(f"{BASE_URL}/api/media/stats").json()
        
        assert updated_stats["total_files"] == initial_count + 1, "Total files should increase by 1"
        assert updated_stats["by_type"]["images"] == initial_images + 1, "Image count should increase by 1"
        
        print(f"✓ Stats updated correctly: {initial_count} -> {updated_stats['total_files']} files")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
